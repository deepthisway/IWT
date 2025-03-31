"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middle_1 = require("./middle");
const express = require('express');
const app = express();
app.get('/middle', middle_1.middle, (req, res) => {
    res.send('Hello World');
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
