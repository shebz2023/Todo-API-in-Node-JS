"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logging_1 = __importDefault(require("../library/logging"));
const errorHandler = (err, req, res, next) => {
    logging_1.default.error(err);
    res.status(500).json({ message: 'Server Error' });
};
exports.errorHandler = errorHandler;
