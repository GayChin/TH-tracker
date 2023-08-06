# TH-tracker
A simple realtime temperature and humidity tracker built using MQTT, InfluxDB, Socket.io and Vue.js. 
![TH Tracker](https://github.com/GayChin/TH-tracker/assets/56284497/b7b57de3-ba15-47f7-97cb-7298396ce97d)

You can filter the data based on `location`, `time` and `aggregation type`. 
![image](https://github.com/GayChin/TH-tracker/assets/56284497/aa9ac715-7238-4b66-9211-03724ddedb21)

The chart shows all locations' data in the past 30 days and group in the window of an hour as mean by default. 


### To run the application
Make sure you have [Mosquitto](https://mosquitto.org/download/) and [InfluxDB](https://docs.influxdata.com/influxdb/v2.6/install/?t=Windows) installed in your machine.

To start the server, in the server folder, run the following command. 
```
npm run start
```

To start the client, in the client folder, run 
```
npm run dev
```
