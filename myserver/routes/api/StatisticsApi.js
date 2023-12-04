const express = require('express');
const router = express.Router();
const statisticsService = require('../../components/statistics/StatisticsService.js');
router.get('/order', async function (req, res, next) {
  try {
    const { dateType, orderStatus, fromDate, toDate, dateLabelFormat } = req.query;
    const data = await statisticsService.getTotalOrderStatistics(
      dateType,
      orderStatus,
      fromDate,
      toDate,
      dateLabelFormat
    );

    return res.status(200).json({ result: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
