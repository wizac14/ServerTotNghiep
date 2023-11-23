const express = require('express');
const router = express.Router();
var moment = require('moment');
var ip = require('ip');
var querystring = require('qs');
var crypto = require('crypto');

const orderService = require('../../components/order/OrderService');

router.post('/', async function (req, res, next) {
  try {
    let newOrder = await orderService.createOrder(req.body);
    return res.status(200).json({ order: newOrder });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//http://localhost:3000/api/order/all
router.get('/all', async function (req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//http://localhost:3000/api/order/:orderId
router.get('/:orderId', async function (req, res, next) {
  const { orderId } = req.params;
  try {
    const orders = await orderService.getOrderByOrderId(orderId);
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//http://localhost:3000/api/order/user-orders/:userId
router.get('/user-orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const result = await orderService.getUserOrders(userId);
    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    const orders = result.orders;

    // Đếm số mặt hàng trong mỗi đơn hàng
    const ordersWithProductCount = await Promise.all(
      orders.map(async (order) => {
        const productCountResult = await orderService.getProductCountInOrder(order._id);

        if (productCountResult.success) {
          return { ...order._doc, productCount: productCountResult.productCount };
        } else {
          return { ...order._doc, productCount: 0 };
        }
      })
    );

    // lấy số lượng đơn hàng của người dùng
    const resultOrderCount = await orderService.getUserOrderCount(userId);
    if (!resultOrderCount.success) {
      return res.status(500).json({ message: resultOrderCount.message });
    }

    res.status(200).json({
      orders: result.orders,
      orderCount: resultOrderCount.orderCount,
      orders: ordersWithProductCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
