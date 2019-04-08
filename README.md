# Infinity Geckoboard Integration POC

## Background
This is a proof of concept to integrate Infinity page count channel metrics with a Geckboard Bar Chart widget. Infinity's [Reports API](https://www.infinity.co/service/api/reports_v2_basics.html) is utilized to get the top 5 page counts totals by channel for a given date rage(defaults to the current date) via their [metrics endpoint](https://www.infinity.co/service/api/reports_v2_metrics.html). This data is then formatted in accordance with Geckboard's [Bar Chart widget](https://developer-custom.geckoboard.com/#bar-chart). The formatted data is the pushed to Geckboard via their [Push API](https://developer-custom.geckoboard.com/#push-overview).

Note: The `pageCountTotal` metric is currently hardcode as the metric. Reference Infinity's `Filter Types` in the [Reports API Metrics](https://www.infinity.co/service/api/reports_v2_metrics.html) docs for other available options. 


## Setup
Install dependencies
```
npm install
```

## Config
Add an .env file in the root directory of the project and update it with required env variables. For required env variables reference `.env.exmaple`

**Example .env**
```
INFINITY_USERNAME="Your.Username@infinitycloud.com"
INFINITY_PASSWORD="example-password"
INFINITY_IGRP=1234 # Update with your Infinity IGRP SPECIFIER

GECKO_API_KEY="example-api-key" # Update with your Geckoboard API key
GECKO_WIDGET_KEY="example-widget-key" # Geckoboard widget-key that data will be sent to

# Optional
START_DATE="2018-12-15" # Defaults to current date
END_DATE="2018-12-15" # Defaults to current date


```

## Run
```
npm run start
```
