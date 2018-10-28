'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const config = {
    channelSecret: '',
    channelAccessToken: ''
};
const app = express();

function init () {
    initProperties();
}

function initProperties() {
    var fs = require("fs");
    var json = JSON.parse(fs.readFileSync('properties.json', 'utf8'));
    config.channelSecret = json.channelSecret;
    config.channelAccessToken = json.channelAccessToken;
}

init();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log('here 1');
    console.log(req.body.events);
    console.log('here 2');
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

// app.get('/', line.middleware(config), (req, res) => {
//     console.log(req.body.events);
//     res.send('Hello Hori!');
// });

const client = new line.Client(config);

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        console.log('unsupported message comming...');
        return Promise.resolve(null);
    }
    console.log('try to reply!');
    return client.replyMessage(event.replyToken, {
        type: 'text',
        test: event.message.text
    });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);