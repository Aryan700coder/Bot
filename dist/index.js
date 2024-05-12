"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const tslib_1 = require("tslib");
const client_1 = tslib_1.__importDefault(require("./structure/client"));
exports.client = new client_1.default();
exports.client.start();
