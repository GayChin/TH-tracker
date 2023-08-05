import { SITE_DATA } from "./constants/site-data.js";
import { client } from "./mqtt.js";

const TEMP_MAX = 40;
const TEMP_MIN = 15;
const HUMID_MAX = 80;
const HUMID_MIN = 55;
const PUBLISH_FREQ = 3;

const lastValues = {};
let publishTaskInterval;

const generateRandomValue = (min, max) => {
  return min + Math.random() * (max - min);
};

export const generateData = () => {
  const timestamp = Date.now();
  for (let i = 0; i < SITE_DATA.locations.length; i += 1) {
    const locationName = SITE_DATA.locations[i].locationName;
    let lastValue = lastValues[locationName];
    if (!lastValue) {
      const temperature = generateRandomValue(TEMP_MIN, TEMP_MAX);
      const humidity = generateRandomValue(HUMID_MIN, HUMID_MAX);
      lastValue = {
        temperature,
        humidity,
      };
    } else {
      lastValue.temperature += generateRandomValue(-0.5, 0.5);
      lastValue.temperature = Math.max(
        TEMP_MIN,
        Math.min(TEMP_MAX, lastValue.temperature)
      );
      lastValue.humidity += generateRandomValue(-5, 5);
      lastValue.humidity = Math.max(
        HUMID_MIN,
        Math.min(HUMID_MAX, lastValue.humidity)
      );
    }
    // first parameter is topic, second is message
    client.publish(
      `${locationName}/data/`,
      JSON.stringify({
        locationName,
        timestamp,
        ...lastValue,
      })
    );
    lastValues[locationName] = lastValue;
    // console.log(`Published data for ${locationName} @${timestamp}`);
  }
};

export const startDataGenerator = () => {
  publishTaskInterval = setInterval(generateData, PUBLISH_FREQ * 1000);
};

export const stopDataGenerator = () => {
  clearInterval(publishTaskInterval);
  console.log("Data generator is stopped");
};
