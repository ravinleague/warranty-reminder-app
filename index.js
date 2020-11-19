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
const moment = require('moment');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const PORT = process.env.PORT || 5005;
const oneSignalAppID = "bbd07d25-66d8-49f4-b8f1-e73d92e822ab";
const oneSignalApiKey = "MjZkYWM2YmUtY2JiOS00ZmQ1LTg1NTAtMWRiNmQ2ZGQwNTJm";
const oneSignalClient = new OneSignal.Client(oneSignalAppID, oneSignalApiKey);

app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT, function () {
  console.log('Our app is running' + PORT);
});

const connectionString = 'postgres://xatbsbvsgcqzxb:ea28bdb8f38f801aa2a05c10bf0cef48a7d9962f09068847e70c8ae47b2dd0a6@ec2-52-2-82-109.compute-1.amazonaws.com:5432/dafmu2fnj3a81n'
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
    console.log('database connected');
  }
});



cron.schedule('* * * * *', function () {
  client
    .query(`SELECT * from item_info`)
    .then(res => {
      let rows = res.rows
      rows.forEach(row => {
        console.log(row);
        var date1 = moment(new Date());
        var date2 = moment(row.itemwarrantyexpirydate);
        var diffInDays = date2.diff(date1,'days');
        const itemName = row.itemname;
        const notificationDays = row.notificationdays;
        const onesignalid = row.onesignalid;
        console.log(diffInDays + "--" + notificationDays);
        if(diffInDays <= notificationDays && notificationDays > -1){
          oneSignalClient.createNotification(
            {
              contents: { "en": `${itemName} warranty expires ${moment(date2).format('ll')}` },
              headings: { "en": `${itemName} warranty update`},
              include_player_ids: [onesignalid]
            }).then(() => {

            }).catch((err) => {
              throw err;
            })
        }
        
        var postData = null;
        
      });
    })
    .catch(e => console.error(e.stack ))

})

app.post("/muteNotificationsForItem", (req, res) => {
  console.log("adding item....")
  const nowDate = new Date();//.toISOString();
  const itemName = req.body.itemName;
  const itemWarrantyExpiryDate = req.body.itemWarrantyExpiryDate;
  const oneSignalID = req.body.oneSignalId;
  const notificationDays = req.body.notificationDays;
  
  client.query(`UPDATE item_info SET notificationdays = -1 WHERE itemname = '${itemName}' AND oneSignalID = '${oneSignalID}'`)
  .then(res => {
    return res
  }
  )
  .catch(e => console.error(e.stack))
});

app.post("/addItem", (req, res) => {
  console.log("adding item....")
  const nowDate = new Date();//.toISOString();
  const itemName = req.body.itemName;
  const itemWarrantyExpiryDate = req.body.itemWarrantyExpiryDate;
  const oneSignalID = req.body.oneSignalId;
  const notificationDays = req.body.notificationDays;
  const insertQuery = {
    text: 'INSERT INTO item_info(itemName, itemWarrantyExpiryDate, onesignalid,createdDate,notificationDays) VALUES ($1,$2,$3,$4,$5)',
    values: [itemName, itemWarrantyExpiryDate, oneSignalID,nowDate,notificationDays]
  }
  client.query(insertQuery)
  .then(res => {
    return res
  }
  )
  .catch(e => console.error(e.stack))
});

app.post("/deleteItem", (req, res) => {
  const itemName = req.body.itemName;
  const itemWarrantyExpiryDate = req.body.itemWarrantyExpiryDate;
  const deleteQuery = `DELETE FROM item_info
  WHERE itemName = '${itemName}' AND itemWarrantyExpiryDate = '${itemWarrantyExpiryDate}'
  RETURNING *`
  client
  .query(deleteQuery)
  .then(res => console.log(res.rowCount))
  .catch(e => console.error(e.stack))
})





//Insert tracking number in to table
//const insertTrackingNumberText = 'INSERT INTO trackingNumber(name, email) VALUES($1, $2) RETURNING *'