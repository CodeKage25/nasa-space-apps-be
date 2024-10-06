const express = require('express');
const farmRouter = require('./farm/farm.router')

const api = express.Router();

api.use('/assess', farmRouter)


module.exports = api;