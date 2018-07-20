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
        .then(result => {
          if (result === null || result === undefined) {
            return res.status(204).send({message: 'content missing'});
          } else {
            res.status(200).send({endpoint: 'endpoint'});
          }
        });
      break;
    case 'POST':
      break;
    default:
      res.status(500).send({error: 'invalid request'});
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