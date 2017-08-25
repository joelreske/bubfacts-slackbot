var dotenv = require('dotenv');
dotenv.load();

var http = require('http');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bubfacts.db');

const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))

app.post('/commands/bubfacts', function (req, res) {
  let payload = req.body

  if (!payload || payload.token !== process.env.SLACK_TOKEN) {
    let err = '✋  Star—what? An invalid slash token was provided\n' +
              '   Is your Slack slash token correctly configured?'
    console.log(err)
    res.status(401).end(err)
    return
  }

  payload.text = payload.text.replace("<@"+BOT_ID+">", "");
  payload.text = payload.text.toLowerCase();
  var query = "SELECT * FROM bubs WHERE instr(\"" + payload.text + "\", LOWER(first)) > 0";
  query += " OR instr(\"" + payload.text + "\", LOWER(last)) > 0";
  query += " OR instr(\"" + payload.text + "\", LOWER(bub_year)) > 0";

  console.log(query);
  db.each(query, function(err, row) {
      if (row){
        console.log(row.full);
        res.send(" "+ row.full + ", B'"+ row.bub_year.substring(2,4) +"\n");
      }
  });
});

app.listen(process.env.PORT, (err) => {
  if (err) throw err

  console.log(`\n🚀  BubBot LIVES on PORT ${process.env.PORT} 🚀`);
});

var request = require('request');
