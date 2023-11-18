const express = require('express');
const router = express.Router();
var moment = require('moment');
var ip = require('ip');
var querystring = require('qs');
var crypto = require('crypto');
const request = require('request');
require('dotenv').config();
const orderService = require('../../components/order/OrderService');

router.post('/', async function (req, res, next) {
  try {
    let newOrder = await orderService.createOrder(req.body);
    return res.status(200).json({ order: newOrder });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/all', async function (req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:orderId', async function (req, res, next) {
  const { orderId } = req.params;
  try {
    const orders = await orderService.getOrderByOrderId(orderId);
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
