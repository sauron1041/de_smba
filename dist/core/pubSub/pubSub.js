"use strict";
// // import { EventEmitter } from 'events';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // const eventEmitter = new EventEmitter();
// // export default eventEmitter;
// import { EventEmitter } from 'events';
// const eventEmitter = new EventEmitter();
// export default eventEmitter;
const events_1 = __importDefault(require("events"));
class PubSub extends events_1.default {
}
const eventEmitterInstance = new PubSub();
exports.default = eventEmitterInstance;
//# sourceMappingURL=pubSub.js.map