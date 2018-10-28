'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const config = {
    channelSecret: '6c47315ec1f0709ce2aaad0cd29fa480',
    channelAccessToken: 'eKLxOeZmVZdQc108lLhrgN0PDazS+iF7l40uB2n+G8vHrfU4aT8W/QDwyl6+XL3+jQTlLqZOe0Kf6ngk33DVT8t9y+TPFEvVtzfsdSvqmd15CjHWPA6Ln8Zk0XFm5BPGa/fITzQLXWdZhfRa7uPS1QdB04t89/1O/w1cDnyilFU='
};
const app = express();

function init () {
    initProperties();
}

function initProperties() {
    var fs = require("fs");
    fs.readFile("linebot.properties", "utf8", (error, data) => {
        if (error) {
            console.log('read properites occures error');
            return;
        }
        console.log(data);
        console.log(data.Channel_Secret);
        console.log(data.Channel_Access_Token);
    })
}

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    return client.replyMessage(event.replyToken, {
        type: 'text',
        test: event.message.text
    });
}

init();
app.listen(PORT);
console.log(`Server running at ${PORT}`);