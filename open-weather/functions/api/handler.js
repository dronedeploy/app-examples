/**
 * This is the primary file for custom code and functionality.
 */

const request = require('request');
const tableUtils = require('./datastore/table');
const md5 = require('md5');

// Name of the table. This should be the same as the table name in serverless.yml
const TABLE_NAME = 'api-table';
const OPEN_BASE_API = 'http://api.agromonitoring.com/agro/1.0';
const OPEN_PATHS = {
  polygon: 'polygons',
  image: 'image'
};

const thirtyDaysInSeconds = 2592000;

const imageApiBuilder = (startDate, endDate, polygonId, apiKey) => {
  let args = ['start=' + startDate, 'end=' + endDate, 'polyid=' + polygonId, 'appid=' + apiKey];
  return [OPEN_BASE_API, OPEN_PATHS.image, 'search'].join('/') + '?' + args.join('&');
}

const polygonApiBuilder = (apiKey) => {
  let args = ['appid=' + apiKey];
  return [OPEN_BASE_API, OPEN_PATHS.polygon].join('/') + '?' + args.join('&');
}

const parseGeo = (geo) => {
  var parsed = [];
  for (i in geo) {
    parsed.push([geo[i].lng, geo[i].lat]);
  }
  parsed.push([geo[0].lng, geo[0].lat]);
  return [parsed];
}

const getCurrentTimeInSeconds = () => {
  return Date.now() / 1000 | 0;
}

const getStartTime = () => {
  return getCurrentTimeInSeconds() - thirtyDaysInSeconds;
}

const getTiles = (req, res, ctx) => {
  if (req.method != 'POST') {
    return res.status(400).send('bad request');
  }
  const reqData = JSON.parse(req.body);

  const hashedUsername = md5(ctx.token.username);
  tableUtils.getTableData(ctx, hashedUsername)
    .then((data) => {
      if (data === null || data === undefined) {
        console.log('API key not found');
        return res.status(500).send('server error');
      }
      console.log('polygon API: ' + polygonApiBuilder(data.key));
      let polyOpts = {
        uri: polygonApiBuilder(data.key),
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        json: {
          name: reqData.planName,
          geo_json: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: parseGeo(reqData.geo)
            }
          }
        }
      }
      console.log(JSON.stringify(polyOpts.json));
      request(polyOpts, (error, response, polyBody) => {
        if (error || polyBody.error) {
          console.error('response code from polygon create: ', response.status);
          console.error('error creating polygon: ', error);
          console.log(JSON.stringify(polyBody));
          console.error('error body response: ', polyBody.error);
          return res.status(500).send('error creating polygon');
        }

        console.log('polygon successfully created on agromonitoring.com');
        console.log(JSON.stringify(polyBody));
        let tileOpts = {
          uri: imageApiBuilder(getStartTime(), getCurrentTimeInSeconds(), polyBody.id, data.key),
          method: 'GET'
        }
        request(tileOpts, (tileError, tileResponse, tileBody) => {
          if (error) {
            console.error('error getting tiles: ', error);
            return res.status(500).send('error creating tiles'); 
          }
          if (tileBody.length <= 0) {
            console.error('no tiles found');
            return res.status(404).send('no tiles available');
          }

          return res.status(200).send(tileBody);
        });
      });
    });
}

/**
 * Handles requests for storing and retrieving the API key for Open Weather
 * 
 * Returns the following http codes:
 * 200 - ok
 * 204 - content missing (No previous api key found)
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
  const hashedUsername = md5(ctx.token.username);
  switch (req.method) {
    case 'GET':
      return tableUtils.getTableData(ctx, hashedUsername)
        .then((data) => {
          if (data === null || data === undefined) {
            return res.status(204).send('content missing');
          }
          return res.status(200).send(data.key);
        });
      break;
    case 'POST':
      const { key } = JSON.parse(req.body);
      return tableUtils.setTableData(ctx, hashedUsername, key)
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
    case '/tiles':
      getTiles(req, res, ctx);
      break;
    // Route requests for storing and retrieving IFTTT URL
    case '/store':
      storeHandler(req, res, ctx);
      break;
    default:
      return res.status(400).send('bad request');
  }
};