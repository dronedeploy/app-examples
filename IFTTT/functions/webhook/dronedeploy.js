'use strict';

const bootstrap = require('@dronedeploy/function-wrapper');
const handler = require('./handler');

exports.dronedeploy = bootstrap((ctx) => (req, res) => handler.helloWorld(req, res, ctx));