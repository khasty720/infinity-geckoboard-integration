require('dotenv').config();
const fetch = require('node-fetch');

const inputData = {
  username: process.env.INFINITY_USERNAME,
  password: process.env.INFINITY_PASSWORD,
  igrp: process.env.INFINITY_IGRP,
  tz: 'America/Chicago',
  sort: 'pageCountTotal-desc',
  group: 'ch',
  limit: 5,
  format: 'jsonarray',
  apiKey: process.env.GECKO_API_KEY,
  widgetKey: process.env.GECKO_WIDGET_KEY
}

const getCurrentDate = () => {
  const currentDate = new Date().toISOString();
  const date = currentDate.split('T')[0];
  return `${date.split('-')[0]}-${date.split('-')[1]}-${date.split('-')[2]}`;
}

// Get channel metics from Infinity API
const getMetricData = async () => {
  const { igrp, sort, group, limit, format, tz } = inputData;

  // Start and end dates can be overriden with env vars. Defaults to current date.
  const startDate = process.env.START_DATE || getCurrentDate();
  const endDate = process.env.END_DATE || getCurrentDate();

  let headers = new fetch.Headers();
  headers.set('Authorization', 'Basic ' + Buffer.from(inputData.username + ":" + inputData.password).toString('base64'));

  const params = `?igrp=${igrp}&startDate=${startDate}&endDate=${endDate}&tz=${tz}&sort[]=${sort}&group[]=${group}&limit=${limit}&format=${format}`;
  const res = await fetch(`https://api.infinitycloud.com/reports/v2/metrics/channels${params}`, {
    headers: headers,
  });

  return await res.json();
}

// Format data for a Geckoboard bar chart widget
// Geckoboard docs for bar chart data format: https://developer-custom.geckoboard.com/#bar-chart
const formatData = (data) => {
  let initData = {
    x_axis: {
      labels: []
    },
    series: [
      {
        data: []
      }
    ]
  };

  return data.reduce((accumulator, currentValue) => {
    accumulator.x_axis.labels.push(currentValue.chName);
    accumulator.series[0].data.push(parseFloat(currentValue.pageCountTotal));
    return accumulator;
  }, initData);
};

// POST formated data to Geckoboard widget endpoint
const postToWidget = async (data) => {
  const body = {
    api_key: inputData.apiKey,
    data: data,
  };

  const resp = await fetch(`https://push.geckoboard.com/v1/send/${inputData.widgetKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const run = async () => {
  const metricData = await getMetricData();
  const chartData = formatData(metricData);
  console.log('Chart Data: ', JSON.stringify(chartData));
  await postToWidget(chartData);
}

run();
