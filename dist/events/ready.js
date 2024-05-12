"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const event_1 = require("../structure/event");
exports.default = new event_1.Event('ready', () => {
    console.log(`${__1.client.user.username} is online!!`);
});
