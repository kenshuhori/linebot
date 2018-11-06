'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const config = {
    channelSecret: '',
    channelAccessToken: ''
};
const cokekocoo = 'Ud94926cc8fa813875e2074d27c1c0180';
const groupId = 'R30834385e949ba3ccf4815d787f2c1da';
const app = express();

function initProperties() {
    var fs = require("fs");
    var json = JSON.parse(fs.readFileSync('properties.json', 'utf8'));
    config.channelSecret = json.channelSecret;
    config.channelAccessToken = json.channelAccessToken;
}
initProperties();

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    if (event.message.text === 'グループ') {
        console.log('グループグループ');
        pushMessage(groupId);
    }
    if (event.message.text === 'ほり') {
        console.log('ほりほり');
        pushMessage(cokekocoo);
    }
    console.log(event.source.type);
    console.log(event.source.userId);
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}

function pushMessage(id) {
    client.pushMessage(id, {
        type: 'text',
        text: 'ポムポムbotから発信！'
    })
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);