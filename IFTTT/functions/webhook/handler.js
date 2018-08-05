/**
 * This is the primary file for custom code and functionality.
 */

const request = require('request');
const tableUtils = require('./datastore/table');

// Name of the table. This should be the same as the table name in serverless.yml
const TABLE_NAME = 'webhook-table';

 /**
 * Handles DroneDeploy Trigger events
 *
 * Sends the following information to IFTTT:
 * value1: username      | the username of the user who requested the export
 * value2: status        | the status of the export (COMPLETE, FAILED)
 * value2: downloadPath  | the URL link to the export
 *
 * Returns the following http codes:
 * 200 - ok
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
const triggerHandler = (req, res, ctx) => {
  console.log('trigger');
  const event = req.body;
  if (event.data.event.object_type === "Export") {
    tableUtils.getExportData(ctx, event.data.node.id)
      .then((exportQuery) => {
        console.log(exportQuery);
        if (!exportQuery.ok) {
          console.error('error retrieving trigger object');
          res.status(500).send('server error');
        }
        console.log(ctx.token.username);
        tableUtils.getTableData(ctx, ctx.token.username)
          .then((data) => {
            if (data === null || data === undefined) {
              console.log('IFTTT url not found');
              return res.status(500).send('server error');
            }
            let opts = {
              uri: data.endpoint,
              method: 'POST',
              headers: {
                "Content-Type": "application/json"
              },
              json: {
                value1: exportQuery.data.node.user.username,
                value2: exportQuery.data.node.status,
                value3: exportQuery.data.node.downloadPath
              }
            }
            request(opts, (error, response, body) => {
              if (error) {
                console.error('error sending to IFTTT', error);
                return res.status(500).send('server error');
              }
              console.error('event successfully sent to IFTTT');
              return res.status(200).send();
            });
          });
      })
  } else {
    return res.status(400).send('bad request, cannot handle this trigger event');
  }
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
          if (data === null || data === undefined) {
            return res.status(204).send('content missing');
          }
          return res.status(200).send(data.endpoint);
        });
      break;
    case 'POST':
      const { endpoint } = JSON.parse(req.body);
      return tableUtils.setTableData(ctx, ctx.token.username, endpoint)
        .then((result) => {
          if (result === null || result === undefined || !result.ok) {
            return res.status(500).send('server error');
          }
          return res.status(200).send();
        });
      break;
    default:
      return res.status(400).send('bad request');
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
    case '/__ddtriggerfunction':
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