import express from "express";
import "dotenv/config";
import { startMQTT } from "./mqtt.js";
import { queryData } from "./database.js";
import cors from "cors";
import { SITE_DATA } from "./constants/site-data.js";

const { APP_URL } = process.env;

const app = express();
const port = 3000;

const LOCATION_NAMES = SITE_DATA.locations.map((el) => el.locationName);

startMQTT();

app.use(cors({ origin: `${APP_URL}` }));

app.get("/", async (req, res) => {
  //   const queryObj = {
  //     field: ["temperature"],
  //     location: ["Office 2"],
  //     timeRange: 3600000 * 8,
  //     window: fluxDuration("5m"),
  //     agFunction: "median",
  //   };

  try {
    const data = await queryData(req.query);

    const mappedData = data.map((item) => ({
      location: item.location,
      field: item._field,
      value: item._value,
      timestamp: item._time,
      result: item.result,
    }));

    const resultData = groupByLocationName(
      mappedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      LOCATION_NAMES
    );

    console.log(resultData);
    res.status(200).send(resultData);

    return;
  } catch (error) {
    console.log("server error: ", error);
  }
});

app.listen(port, () => {
  console.log(`TH tracker server is running on port ${port}`);
});

function groupByLocationName(data, locations) {
  const res = [];
  for (let i = 0; i < locations.length; i++) {
    const tempArr = data.filter((item) => item.location === locations[i]);
    res.push(tempArr);
  }
  return res;
}
