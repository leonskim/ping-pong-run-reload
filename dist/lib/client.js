"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("./message");
function initPingPongRunReload(client, reload) {
    client.onopen = function () {
        client.send(message_1.default.Ping);
    };
    client.onmessage = function (message) {
        if (message.data == message_1.default.Pong) {
            client.send(message_1.default.Ping);
            client.close();
            reload();
        }
    };
}
exports.initPingPongRunReload = initPingPongRunReload;
