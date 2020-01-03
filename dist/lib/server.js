"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var child_process_1 = require("child_process");
var message_1 = require("./message");
var printInfo = function () {
    console.log("================================================");
    console.log(" Please reload iOS Simulator / Android Emulator");
    console.log("================================================");
};
function run() {
    var Status;
    (function (Status) {
        Status[Status["Ready"] = 0] = "Ready";
        Status[Status["Running"] = 1] = "Running";
        Status[Status["Done"] = 2] = "Done";
    })(Status || (Status = {}));
    try {
        var server_1 = new ws_1.Server({ port: 9696 });
        printInfo();
        var status_1 = Status.Ready;
        server_1.on("error", function (e) {
            console.error("WebSocket Error: " + e);
            server_1.close();
        });
        server_1.on("connection", function (conn) {
            var _a = process.argv, preworkCommand = _a[2], mainCommand = _a[3];
            conn.on("message", function (message) {
                if (message == message_1.default.Ping) {
                    switch (status_1) {
                        case Status.Ready:
                            status_1 = Status.Running;
                            preworkCommand && child_process_1.execSync(preworkCommand);
                            conn.send(message_1.default.Pong);
                            break;
                        case Status.Running:
                            status_1 = Status.Done;
                            mainCommand && child_process_1.execSync(mainCommand);
                            conn.send(message_1.default.Pong);
                            break;
                        case Status.Done:
                            conn.send(message_1.default.Pong);
                            server_1.close();
                            break;
                    }
                }
            });
        });
    }
    catch (e) {
        console.error(e);
    }
}
exports.run = run;
