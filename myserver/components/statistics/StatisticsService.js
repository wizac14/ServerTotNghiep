const OrderModel = require('../order/OrderModel');
const moment = require('moment');
const dateUtil = require('../../utils/dateUtil');
const defaultDateFormat = 'YYYY-MM-DD';
let dateFormat = defaultDateFormat;
const getTotalOrderStatistics = async (
  filterDateType,
  orderStatus,
  fromDate,
  toDate,
  dateLabelFormat
) => {
  try {
    if (!fromDate || !toDate || !orderStatus || !filterDateType) {
      throw Error('Missing orderStatus or fromDate or toDate or dateType params');
    }

    dateFormat = dateLabelFormat ? dateLabelFormat : defaultDateFormat;
    filterDateType = filterDateType.toUpperCase();
    orderStatus = orderStatus.toUpperCase();
    switch (filterDateType) {
      case 'YEAR':
        return await getTotalOrderStatisticsByYear(filterDateType, orderStatus, fromDate, toDate);
      case 'MONTH':
        return await getTotalOrderStatisticsByMonth(filterDateType, orderStatus, fromDate, toDate);
      case 'WEEK':
        return await getTotalOrderStatisticsByWeek(filterDateType, orderStatus, fromDate, toDate);
      case 'DAY':
        return await getTotalOrderStatisticsByDayOfWeek(
          filterDateType,
          orderStatus,
          fromDate,
          toDate
        );
      default:
        return `Error get statistic for total order with dateType: ${filterDateType}`;
    }
  } catch (error) {
    console.log('Cannot getTotalOrderStatistics: ' + error.message);
    throw error;
  }
};
const createAggregateForTotalOrders = (filterDateType, orderStatus, fromDate, toDate) => {
  try {
    let aggregate = [
      {
        $match: {
          $and: [
            {
              status: orderStatus === 'ALL' ? { $regex: /./ } : orderStatus,
            },
            {
              createdAt: {
                $gte: moment(fromDate).startOf('date').toDate(),
              },
            },
            {
              createdAt: {
                $lte: moment(toDate).startOf('date').toDate(),
              },
            },
          ],
        },
      },
    ];
    switch (filterDateType) {
      case 'YEAR': {
        aggregate.push(
          {
            $group: {
              _id: {
                $year: '$createdAt',
              },
              total: {
                $count: {},
              },
            },
          },
          {
            $set: {
              year: '$_id',
            },
          }
        );
        break;
      }
      case 'MONTH': {
        aggregate.push(
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
              },
              total: {
                $count: {},
              },
            },
          },
          {
            $set: {
              year: '$_id.year',
              month: '$_id.month',
            },
          }
        );
        break;
      }
      case 'WEEK': {
        aggregate.push(
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                week: { $week: '$createdAt' },
              },
              total: {
                $count: {},
              },
            },
          },
          {
            $set: {
              year: '$_id.year',
              week: '$_id.week',
            },
          }
        );
        break;
      }
      case 'DAY': {
        aggregate.push(
          {
            $group: {
              _id: {
                dayOfWeek: { $dayOfWeek: '$createdAt' },
              },
              total: {
                $count: {},
              },
            },
          },
          {
            $set: {
              dayOfWeek: '$_id.dayOfWeek',
            },
          }
        );
        break;
      }
      default:
        break;
    }
    return aggregate;
  } catch (error) {
    throw error;
  }
};

const getTotalOrderStatisticsByYear = async (filterDateType, orderStatus, fromDate, toDate) => {
  try {
    const queryResult = await OrderModel.aggregate(
      createAggregateForTotalOrders(filterDateType, orderStatus, fromDate, toDate)
    );
    const dates = dateUtil.getYearsBetweenDateRange(fromDate, toDate);
    let result = [];
    const queryResultMap = new Map(
      queryResult.map((obj) => {
        return [obj._id, obj.total];
      })
    );
    for (date of dates) {
      let count = queryResultMap.get(date.getFullYear());
      if (!count) {
        count = 0;
      }
      result.push({ date: moment(date).endOf('year').format(dateFormat), total: count });
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const getTotalOrderStatisticsByMonth = async (filterDateType, orderStatus, fromDate, toDate) => {
  try {
    const queryResult = await OrderModel.aggregate(
      createAggregateForTotalOrders(filterDateType, orderStatus, fromDate, toDate)
    );
    const dates = dateUtil.getMonthsBetweenDateRange(fromDate, toDate);
    let result = [];
    const queryResultMap = new Map(
      queryResult.map((obj) => {
        return [`${obj.year}-${obj.month}`, obj.total];
      })
    );
    for (date of dates) {
      let yearOfDate = date.getFullYear();
      let monthOfDate = date.getMonth() + 1;
      let count = queryResultMap.get(`${yearOfDate}-${monthOfDate}`);
      if (!count) {
        count = 0;
      }
      result.push({ date: moment(date).endOf('month').format(dateFormat), total: count });
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const getTotalOrderStatisticsByWeek = async (filterDateType, orderStatus, fromDate, toDate) => {
  try {
    const queryResult = await OrderModel.aggregate(
      createAggregateForTotalOrders(filterDateType, orderStatus, fromDate, toDate)
    );
    const dates = dateUtil.getWeeksBetweenDateRange(fromDate, toDate);
    let result = [];
    const queryResultMap = new Map(
      queryResult.map((obj) => {
        return [`${obj.year}-${obj.week}`, obj.total];
      })
    );
    for (date of dates) {
      let yearOfDate = date.startWeekDate.getFullYear();
      let startWeekDate = moment(date.startWeekDate).format(dateFormat);
      let endWeekDate = moment(date.endWeekDate).format(dateFormat);
      let weekNumber = date.weekNumber;
      let count = queryResultMap.get(`${yearOfDate}-${weekNumber}`);
      if (!count) {
        count = 0;
      }
      result.push({
        year: yearOfDate,
        startWeekDate: startWeekDate,
        endWeekDate: endWeekDate,
        weekNumber: weekNumber,
        total: count,
        date: `${startWeekDate} - ${endWeekDate}`,
      });
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const getTotalOrderStatisticsByDayOfWeek = async (
  filterDateType,
  orderStatus,
  fromDate,
  toDate
) => {
  try {
    const queryResult = await OrderModel.aggregate(
      createAggregateForTotalOrders(filterDateType, orderStatus, fromDate, toDate)
    );

    let result = [];
    const queryResultMap = new Map(
      queryResult.map((obj) => {
        return [obj.dayOfWeek, obj.total];
      })
    );
    let dayOfWeek = 1;
    while (dayOfWeek <= 7) {
      let total = queryResultMap.get(dayOfWeek);
      if (!total) {
        total = 0;
      }
      result.push({
        dayOfWeek: dayOfWeek,
        date: capitalize(
          moment()
            .locale('vi')
            .weekday(dayOfWeek - 1)
            .format('dddd')
        ),
        total: total,
      });
      dayOfWeek++;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const capitalize = (s) => {
  return s[0].toUpperCase() + s.slice(1);
};
module.exports = {
  getTotalOrderStatistics,
};
