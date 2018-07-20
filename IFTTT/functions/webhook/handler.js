const request = require('request');
const tableUtils = require('./datastore/table');
const TABLE_NAME = 'webhook-table';

const triggerHandler = (req, res, ctx) => {
  // request(params, (error, resp, body) => {

  // })
}

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
            return res.status(500).send('Server Error');
          }
          res.status(200).send();
        });
      break;
    default:
      res.status(500).send('invalid request');
  }
}

exports.routeHandler = function (req, res, ctx) {
  const path = req.path;
  switch(path) {
    case '/dronedeploy/triggers':
      triggerHandler(req, res, ctx);
      break;
    case '/store':
      storeHandler(req, res, ctx);
      break;
    default:
      res.status(404).send('Nothing Here');
  }
};