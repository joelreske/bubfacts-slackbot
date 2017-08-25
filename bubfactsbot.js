var dotenv = require('dotenv');
dotenv.load();

var http = require('http');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bubfacts.db');

var bot_token = process.env.SLACK_BOT_TOKEN || '';

const express = require('express')
const app = express()

app.get('/commands/bubfacts', function (req, res) {
  res.send('Hello World!')
  // message.text = message.text.replace("<@"+BOT_ID+">", "");
  // message.text = message.text.toLowerCase();
  // var query = "SELECT * FROM bubs WHERE instr(\"" + message.text + "\", LOWER(first)) > 0";
  // query += " OR instr(\"" + message.text + "\", LOWER(last)) > 0";
  // query += " OR instr(\"" + message.text + "\", LOWER(bub_year)) > 0";
  //
  // console.log(query);
  // db.each(query, function(err, row) {
  //     if (row){
  //       console.log(row.full);
  //       rtm.sendMessage(" "+ row.full + ", B'"+ row.bub_year.substring(2,4) +"\n", message.channel);
  //     }
  // });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var request = require('request');
