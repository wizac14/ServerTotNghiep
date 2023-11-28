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

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    let order = await OrderModel.findById(orderId);

    if (!order) {
      throw Error('Cannot found Order with id: ' + orderId);
    }

    if (newStatus === OrderStatusEnum.COMPLETED) {
      // Nếu trạng thái mới là COMPLETED, cập nhật trường isPaid
      await OrderModel.updateOne({ _id: orderId }, { status: newStatus, isPaid: true });
    } else {
      // Nếu không phải trạng thái COMPLETED, không cập nhật trường isPaid
      await OrderModel.updateOne({ _id: orderId }, { status: newStatus });
    }

    if (newStatus === OrderStatusEnum.REFUNDED || newStatus === OrderStatusEnum.CANCELED) {
      await productService.updateQuantityForProductByOrder(order?.detail, newStatus);
    }
    await OrderModel.updateOne({ _id: orderId }, { status: newStatus });
    return { message: 'Update successful' };
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
  updateOrderStatus,
};
