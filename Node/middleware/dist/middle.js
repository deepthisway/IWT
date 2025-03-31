"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middle = void 0;
const middle = (req, res, next) => {
    res.json({
        message: 'Hello from the middleware part-445'
    });
    next();
};
exports.middle = middle;
