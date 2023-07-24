import mqtt from "mqtt";
import "dotenv/config";
import { startDataGenerator, stopDataGenerator } from "./data-generator.js";
import { writeData } from "./database.js";

export const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`);

export const startMQTT = () => {
  client.on("connect", function () {
    console.log("MQTT connected");
    client.subscribe("+/data/+", function (err) {
      if (!err) {
        startDataGenerator();
      }
    });
  });

  client.on("close", () => {
    console.log("MQTT disconnected");
    stopDataGenerator();
    client.end();
  });

  // When receive messages
  client.on("message", function (topic, message) {
    message = JSON.parse(message);
    try {
      writeData(message);
    } catch (e) {
      console.log('MQTT error -' , 'topic : ',  topic , ' ' , e.message);
    }
  });
};
