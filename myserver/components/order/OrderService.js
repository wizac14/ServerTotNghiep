const OrderModel = require('./OrderModel');
const ProductModel = require('../products/ProductModel');
const crypto = require('crypto');
const productService = require('../products/ProductService');
const { OrderStatusEnum } = require('./OrderStatusEnum');
const { default: mongoose } = require('mongoose');
const cartService = require('../cart/CartService');

const createOrder = async (orderData) => {
  try {
    let { userId, totalAmount, address, phoneNumber, products, isPaid, paymentDetail } = orderData;
    let status = OrderStatusEnum.ORDERED;
    if (isPaid) {
      status = OrderStatusEnum.PURCHASED;
    }
    await productService.updateQuantityForProductByOrder(products, status);
    cartService.removeAllProductsFromCart(userId);
    let newOrder = new OrderModel({
      userId: userId,
      detail: products,
      paymentTransactionRef: paymentDetail ? paymentDetail.transactionRef : '',
      status: status,
      totalAmount: totalAmount,
      address: address,
      isPaid: isPaid,
      uuid: crypto.randomUUID().slice(0, 6).toUpperCase(),
      phoneNumber: phoneNumber.toString(),
    });
    await newOrder.save();
    return newOrder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getOrderByOrderId = async (orderId) => {
  try {
    const orders = await OrderModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $unwind: {
          path: '$detail',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'detail.productId',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$products',
        },
      },
      {
        $unwind: {
          path: '$products.variances',
        },
      },
      {
        $match: {
          $expr: {
            $eq: ['$products.variances.color', '$detail.color'],
          },
        },
      },
      {
        $addFields: {
          'detail.images': '$products.variances.images',
          'detail.title': '$products.title',
        },
      },
      {
        $project: {
          products: 0,
          userId: 0,
          'user.password': 0,
        },
      },
      {
        $set: {
          user: {
            $first: '$user',
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          groupRoot: {
            $first: '$$ROOT',
          },
          combineDetail: {
            $addToSet: '$detail',
          },
        },
      },
      {
        $addFields: {
          'groupRoot.detail': '$combineDetail',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$groupRoot',
        },
      },
    ]);
    return orders;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllOrders = async () => {
  try {
    const orders = await OrderModel.find().populate('userId').exec();
    return orders;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserOrders = async (userId) => {
  try {
    const orders = await OrderModel.find({ userId }).populate('detail.productId');

    if (!orders || orders.length === 0) {
      return { success: false, message: 'No orders found for this user.' };
    }

    return { success: true, orders };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getUserOrderCount = async (userId) => {
  try {
    const orderCount = await OrderModel.countDocuments({ userId });

    return { success: true, orderCount };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getProductCountInOrder = async (orderId) => {
  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    const productCount = order.detail.length;

    return { success: true, productCount };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


const calculateTotalAmountByUserAndStatus= async(userId, isPaid, fromDate, toDate) =>{
  try {
    const totalAmount = await OrderModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isPaid: Boolean(isPaid),
          createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    return totalAmount.length > 0 ? totalAmount[0].total : 0;
  } catch (error) {
    throw error;
  }
}
const calculateTotalAmountByMonthAndStatus= async (userId, isPaid) =>{
  try {
    const totalAmountByMonth = await OrderModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isPaid: Boolean(isPaid)
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalAmount: { $sum: "$totalAmount" },
          totalProducts: { $sum: { $size: "$detail" } }
        }
        
      }
      ,
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    return totalAmountByMonth;
  } catch (error) {
    throw new Error(error.message);
  }
}

const getDailyPayments = async (userId, isPaid,fromDate, toDate) => {
  try {
    const result = await OrderModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isPaid: Boolean(isPaid),
          createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalAmount: { $sum: "$totalAmount" },
          totalProducts: { $sum: { $size: "$detail" } }
        }
      }
      ,
      {
        $sort: { _id: 1 } // Sắp xếp theo ngày tăng dần
      }
      
    ]);

    return result.map(item => {
      return {
        date: item._id,
        totalAmount: item.totalAmount,
        totalProducts:item.totalProducts
      };
    });
  } catch (error) {
    throw error;
  }
}
const getProductCountByDay = async (userId, fromDate, toDate) => {
  try {
    const result = await OrderModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
          isPaid: true // Thêm điều kiện đã thanh toán
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalProducts: { $sum: { $size: "$detail" } }
        }
      },
      {
        $sort: { _id: 1 } // Sắp xếp theo ngày tăng dần
      }
    ]);

    return result;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderByOrderId,
  getUserOrders,
  getUserOrderCount,
  getProductCountInOrder,
  calculateTotalAmountByUserAndStatus,
  calculateTotalAmountByMonthAndStatus,
  getDailyPayments,
  getProductCountByDay
};
