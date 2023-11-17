const OrderModel = require('./OrderModel');
const ProductModel = require('../products/ProductModel');
const crypto = require('crypto');
const productService = require('../products/ProductService');
const { OrderStatusEnum } = require('./OrderStatusEnum');
const { default: mongoose } = require('mongoose');
const createOrder = async (
  userId,
  totalAmount,
  address,
  phoneNumber,
  products,
  isPaid,
  paymentTransactionRef
) => {
  try {
    let status = OrderStatusEnum.ORDERED;
    if (isPaid) {
      status = OrderStatusEnum.PURCHASED;
    }
    await productService.updateQuantityForProductByOrder(products, status);

    let newOrder = new OrderModel({
      userId: userId,
      detail: products,
      paymentTransactionRef: paymentTransactionRef,
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

module.exports = {
  createOrder,
  getAllOrders,
  getOrderByOrderId,
};
