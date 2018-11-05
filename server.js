'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const config = {
    channelSecret: '',
    channelAccessToken: ''
};
const cokekocoo = 'Ud94926cc8fa813875e2074d27c1c0180';
const app = express();

function init() {
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
    console.log(req.body.events);
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
        return Promise.resolve(null);
    }
    console.log(event.source.type);
    console.log(event.source.userId);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}

function pushMessage() {
    var postData = {
        'to': cokekocoo,
        'messages': [{
            'type': 'text',
            'text': 'hello kenshu.'
        }]
    };
    var url = 'https://api.line.me/v2/bot/message/push';
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.channelAccessToken
    };
    var options = {
        'method': 'post',
        'headers': headers,
        'payload': JSON.stringify(postData)
    };
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);