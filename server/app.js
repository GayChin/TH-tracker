import express from "express";
import "dotenv/config";
import { startMQTT } from "./mqtt.js";
import { queryData } from "./database.js";
import cors from "cors";

const { APP_URL } = process.env;

const app = express();
const port = 3000;

// startMQTT()

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
    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.log("server error: ", error);
  }
});

app.listen(port, () => {
  console.log(`TH tracker server is running on port ${port}`);
});
