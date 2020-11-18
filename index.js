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

const connectionString = '        postgres://xatbsbvsgcqzxb:ea28bdb8f38f801aa2a05c10bf0cef48a7d9962f09068847e70c8ae47b2dd0a6@ec2-52-2-82-109.compute-1.amazonaws.com:5432/dafmu2fnj3a81n'
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

pp.post("/addItem", (req, res) => {
  console.log("adding item....")
  const nowDate = new Date();//.toISOString();
  const itemName = req.body.itemName;
  const itemWarrantyExpiryDate = req.body.itemWarrantyExpiryDate;
  const oneSignalID = req.body.oneSignalId;
  const insertQuery = {
    text: 'INSERT INTO item_info(itemName, itemWarrantyExpiryDate, onesignalid,createdDate) VALUES ($1,$2,$3,$4)',
    values: [itemName, itemWarrantyExpiryDate, oneSignalID,nowDate]
  }
  client.query(insertQuery)
  .then(res => {
    return res
  }
  )
  .catch(e => console.error(e.stack))
});




//Insert tracking number in to table
//const insertTrackingNumberText = 'INSERT INTO trackingNumber(name, email) VALUES($1, $2) RETURNING *'