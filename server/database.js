import "dotenv/config";
import {
  InfluxDB,
  Point,
  HttpError,
  flux,
  fluxDuration,
} from "@influxdata/influxdb-client";

const { INFLUXDB_TOKEN, INFLUXDB_ORG, INFLUXDB_BUCKET } = process.env;
const dbClient = new InfluxDB({
  url: "http://localhost:8086",
  token: INFLUXDB_TOKEN,
});

const hourInMS = 3600000;

export const writeData = async (data) => {
  const writeApi = dbClient.getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET, "ms");
  writeApi.useDefaultTags({ host: "my-computer" });

  const point = new Point("data")
    .tag("location", data.locationName)
    .tag("devices", data.deviceId)
    .floatField("temperature", data.temperature)
    .floatField("humidity", data.humidity)
    .timestamp(data.timestamp);

  writeApi.writePoint(point);

  try {
    await writeApi.close();
    console.log("DATA SUCCESFULLY WRITTEN... ");
  } catch (e) {
    console.error(e);
    if (e instanceof HttpError && e.statusCode === 401) {
      console.log("Run ./onboarding.js to setup a new InfluxDB database.");
    }
    console.log("\nFinished ERROR");
  }
};

export const queryData = async (queryObj) => {
  const queryApi = dbClient.getQueryApi(INFLUXDB_ORG, INFLUXDB_BUCKET, "ms");

  const {
    field,
    location,
    timeRange = queryObj.timeRange
      ? fluxDuration(queryObj.timeRange)
      : fluxDuration("24h"),
    window = fluxDuration("1m"),
    agFunction = "mean",
  } = queryObj;

  let fluxQuery = `from(bucket:"TH") 
  |> range(start: -${timeRange}) 
  |> filter(fn: (r) => r._measurement == "data")
  `;

  const fieldArray = Array.isArray(field) ? field : [field];
  const locationArray = Array.isArray(location) ? location : [location];

  if (field) {
    for (let i = 0; i < fieldArray.length; i++) {
      if (i == 0) {
        fluxQuery += `|> filter(fn: (r) => r._field == "${fieldArray[i]}"`;
      } else {
        fluxQuery += ` or r._field == "${fieldArray[i]}"`;
      }

      if (i == fieldArray.length - 1) fluxQuery += `)`;
    }
  }

  if (location) {
    for (let i = 0; i < locationArray.length; i++) {
      if (i == 0) {
        fluxQuery += `|> filter(fn: (r) => r.location == "${locationArray[i]}"`;
      } else {
        fluxQuery += ` or r.location == "${locationArray[i]}"`;
      }

      if (i == locationArray.length - 1) fluxQuery += `)`;
    }
  }

  fluxQuery += `
  |> aggregateWindow(every: ${window}, fn: ${agFunction}, createEmpty: false)
  |> yield(name: "${agFunction}")`;

  const data = (await queryApi.collectRows(fluxQuery)).map((item) => ({
    location: item.location,
    device: item.devices,
    field: item._field,
    value: item._value,
    timestamp: item._time,
    result: item.result,
  }));

  return data;
};
