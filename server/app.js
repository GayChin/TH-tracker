import express from "express";
import "dotenv/config";
import { startMQTT } from "./mqtt.js";
import { queryData } from "./database.js";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { SITE_DATA } from "./constants/site-data.js";

const { APP_URL } = process.env;

const port = 3000;
const app = express();
app.use(cors({ origin: `${APP_URL}` }));
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: APP_URL } });

const LOCATION_NAMES = SITE_DATA.locations.map((el) => el.locationName);

startMQTT();

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
    const resultData = transformData(data);
    // console.log(resultData);
    res.status(200).send(resultData);
    return;
  } catch (error) {
    console.log("server error: ", error);
  }
});

function transformData(data) {
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

  return resultData;
}

server.listen(port, () => {
  console.log(`TH tracker server is running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected ");

  socket.on("request-temperature-realtime-data", async (queryOptions) => {
    const data = transformData(await queryData(queryOptions));
    socket.emit("realtime-temperature-data", data);
  });

  socket.on("request-humidity-realtime-data", async (queryOptions) => {
    const data = transformData(await queryData(queryOptions));
    socket.emit("realtime-humidity-data", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

function groupByLocationName(data, locations) {
  const res = [];
  for (let i = 0; i < locations.length; i++) {
    const tempArr = data.filter((item) => item.location === locations[i]);
    res.push(tempArr);
  }
  return res;
}
