const express = require('express');
const {
    assessSoil } = require('./farm.controller');

const farmRouter = express.Router();

farmRouter.post('/', assessSoil)

module.exports = farmRouter;