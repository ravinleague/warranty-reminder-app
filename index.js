// index.js
const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const { Pool, Client } = require('pg');
const { now } = require("moment");
const OneSignal = require('onesignal-node');
const { response } = require("express");
const app = express();
const https = require('https');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const PORT = process.env.PORT || 5001;
const oneSignalAppID = "bbd07d25-66d8-49f4-b8f1-e73d92e822ab";
const oneSignalApiKey = "MjZkYWM2YmUtY2JiOS00ZmQ1LTg1NTAtMWRiNmQ2ZGQwNTJm";
const oneSignalClient = new OneSignal.Client(oneSignalAppID, oneSignalApiKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, function () {
  console.log('Our app is running' + PORT);
});

const connectionString = '    postgres://olcwkvkmlzfsww:9c5b20d95c405bdd70f10fad17c771f61d8f9c483253a905c1908a63868db7bf@ec2-54-235-192-146.compute-1.amazonaws.com:5432/d7pka63of3dtn0'
const pool = new Pool({
  connectionString: connectionString,
  ssl: true
})

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect(err => {
  if (err) {
    console.error('error connecting', err.stack)
  } else {
    console.log('connected');
  }
});



cron.schedule('*/30 * * * *', function () {
  // console.log('cron ran!')
  // //query database
  // client
  //   .query(`SELECT * from deliveryitem WHERE status NOT ILIKE '%delivered%' AND onesignalid NOT ILIKE 'demo'`)
  //   .then(res => {
  //     let rows = res.rows
  //     rows.forEach(row => {
  //       console.log(row.trackingnumber);
  //       const lastStatus = row.status;
  //       const trackingNumber = row.trackingnumber;
  //       const carrier = row.carriercode;
  //       const onesignalid = row.onesignalid;
  //       var postData = null;
  //       sentRes(`${trackingMore_base_url}/trackings/${carrier}/${trackingNumber}`, postData, "GET", function (data) {
  //         const res = JSON.parse(data).data;
  //         const status = res.status.toLowerCase();
  //         var oneSignalStatus = "";
  //         if(status == "delivered"){
  //             oneSignalStatus = "Your parcel has been delivered.";
  //         }else if(status == "transit"){
  //           oneSignalStatus = "Your parcel is in transit"
  //         }else if (status == "1 item has been delivered."){
  //           oneSignalStatus = "Your parcel has been delivered.";
  //         }else{
  //           oneSignalStatus = status;
  //         }
  //         if (status != null && status.toLowerCase() != lastStatus.toLowerCase()) {
  //           client.query(`UPDATE deliveryitem SET status = '${status}' WHERE trackingnumber = '${trackingNumber}'`)
  //             .then(res => {
  //               oneSignalClient.createNotification(
  //                 {
  //                   contents: { "en": `${oneSignalStatus}` },
  //                   headings: { "en": "DELIVERY STATUS UPDATE" },
  //                   include_player_ids: [onesignalid]
  //                 }).then(() => {

  //                 }).catch((err) => {
  //                   throw err;
  //                 })
  //             }).catch((err) => {
  //               throw err;
  //             });
  //         }
  //       });
  //     });
  //   })
  //   .catch(e => console.error(e.stack ))

})




//Insert tracking number in to table
//const insertTrackingNumberText = 'INSERT INTO trackingNumber(name, email) VALUES($1, $2) RETURNING *'