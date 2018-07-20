const request = require('request');
const tableUtils = require('./datastore/table');

// Name of the table. This should be the same as the table name in serverless.yml
const TABLE_NAME = 'webhook-table';

/**
 * Handles DroneDeploy Trigger events
 */
const triggerHandler = (req, res, ctx) => {
  // TODO
}

/**
 * Handles requests for storing and retrieving IFTTT URL
 * 
 * Returns the following http codes:
 * 200 - ok
 * 204 - content missing (No previous IFTTT URL found)
 * 400 - bad request (missing parameters or calling invalid route)
 * 500 - server error (something went wrong)
 * 
 * @method
 * @private
 * @param {Request} req
 * @param {Response} res
 * @param {Object} ctx
 * @returns {Promise} Sends response back to caller
 */
const storeHandler = (req, res, ctx) => {
  switch (req.method) {
    case 'GET':
      return tableUtils.getTableData(ctx, ctx.token.username)
        .then((data) => {
          console.log(data);
          if (data === null || data === undefined) {
            return res.status(204).send('content missing');
          } else {
            res.status(200).send(data.endpoint);
          }
        });
      break;
    case 'POST':
      const { endpoint } = JSON.parse(req.body);
      return tableUtils.setTableData(ctx, ctx.token.username, endpoint)
        .then((result) => {
          if (result === null || result === undefined || !result.ok) {
            return res.status(500).send('server error');
          }
          res.status(200).send();
        });
      break;
    default:
      res.status(400).send('bad request');
  }
}

/**
 * Entry point for a request
 * We are handling routing here based on URL path
 *
 * Base case returns 400 (bad request)
 */
exports.routeHandler = function (req, res, ctx) {
  const path = req.path;
  switch(path) {
    // Route requests for DroneDeploy Trigger events
    case '/__ddfunctions':
      triggerHandler(req, res, ctx);
      break;
    // Route requests for storing and retrieving IFTTT URL
    case '/store':
      storeHandler(req, res, ctx);
      break;
    default:
      res.status(400).send('bad request');
  }
};