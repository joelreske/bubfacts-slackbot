var dotenv = require('dotenv');
dotenv.load();

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var http = require('http');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('bubfacts.db');


var bot_token = process.env.SLACK_BOT_TOKEN || '';

var botname = "bubfacts"
var BOT_ID = "";

var request = require('request');

request('https://slack.com/api/users.list?token='+bot_token, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      if (body.members){
        body.members.forEach(function(element, i, array) {
            if (array[i].name == botname){
              console.log(array[i].name + "  " + array[i].id);
              BOT_ID = array[i].id;
            }
        });
      }
    }
});


var rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
});

rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmReactionAdded(message) {
  if(message.text.includes("<@"+BOT_ID+">")){
    message.text = message.text.replace("<@"+BOT_ID+">", "");
    message.text = message.text.toLowerCase();
    var query = "SELECT * FROM bubs WHERE instr(\"" + message.text + "\", LOWER(first)) > 0";
    query += " OR instr(\"" + message.text + "\", LOWER(last)) > 0";
    query += " OR instr(\"" + message.text + "\", LOWER(bub_year)) > 0";

    console.log(query);
    db.each(query, function(err, row) {
        if (row){
          console.log(row.full);
          rtm.sendMessage(" "+ row.full + ", B'"+ row.bub_year.substring(2,4) +"\n", message.channel);
        }
    });
  }
});
