// web
var err         = require('../lib/web/err');
var httpStatus  = require('../lib/web/httpStatus');

// utils
var _           = require('lodash');

// db utils
var dbFetcher   = require('../lib/db/dbFetcher');
var db          = require('../lib/db/dbHelper');

var initController = function(app, config) {

  var data = {};

  //dbFetcher.dataFolder = path.join(__dirname, dataFolder);
  dbFetcher.dataFolder = config.dataFolder;

  var routes = getRoutes(config.apiRoot);

  /**
   * Endpoint to test that the service is running
   *
   * Example: /api/ping
   */
  app.get(routes.ping, function(req, res) {
    res.send('pong');
  });

  /**
   * Endpoint to get the total number of resources
   *
   * Accepts filters and conditions
   *
   * Example: /api/usuarios/count?q=j
   */
  app.get(routes.count, function(req, res, next) {

    var resource = req.params[0];
    var data = dbFetcher.fetch(resource);
    if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + resource + ' resource');

    var result = db.query(data, req, {len: -1}); // force no pagination
    res.json(result.length);

  });

  /**
   * Endpoint to get a specific resource by id
   *
   * Example: /api/usuarios/23
   *
   * It uses the following regular expression \/api\/(.*)\/(\d+)
   */
  app.get(routes.byId, function(req, res, next) {

    var resources = req.params[0];
    var id = req.params[1];

    var data = dbFetcher.fetch(resources);
    if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + req.path);

    var entity = db.byId(data, id);
    if (entity===null) err.raise(res, err.NOT_FOUND, 'could not find resource ' + resources + ' with id ' + id);

    res.json(entity);
  });

  /**
   * Endpoint to get a list of resources
   *
   * Accepts filters, conditions, sort and pagination
   *
   * Example: /api/usuarios?
   *          order=nombre&sort=desc&q=a&fields=nombre&len=3&page=1
   */
  app.get(routes.resources, function(req, res, next) {

    var resource = req.params[0];
    var data = dbFetcher.fetch(resource);
    if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + resource + ' resource');

    var result = db.query(data, req);
    res.json(result);
  });

  /**
   * Endpoint to modify a resource
   */
  app.put(routes.byId, function(req, res, next) {

    var resources = req.params[0];
    var id = req.params[1];

    var data = dbFetcher.fetch(resources);
    if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + req.path);

    var entity = db.byId(data, id);
    if (entity===null) err.raise(res, err.NOT_FOUND, 'could not find resource ' + resources + ' with id ' + id);

    var updateEntity = req.body;
    delete updateEntity.id;            // prevent id from being modified

    _.extend(entity, updateEntity);    // WARNING: modifying data!!!

    res.json(entity);
  });

  /**
   * Endpoint to create a new resource
   */
  app.post(routes.resources, function(req, res, next) {
    var resources = req.params[0];

    var data = dbFetcher.fetch(resources);
    if (data===null) err.raise(res, err.NOT_FOUND, 'could not find resource ' + resources);

    var newEntity = _.extend({}, req.body, {id: db.nextId(data) });

    data.push(newEntity);

    res.json(httpStatus.CREATED, newEntity);
  });

  /**
   * Endpoint to delete a resource
   */
  app.delete(routes.byId, function(req, res, next) {

    var resources = req.params[0];
    var id = req.params[1];

    var data = dbFetcher.fetch(resources);
    if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + req.path);

    var entity = db.byId(data, id);
    if (entity===null) err.raise(res, err.NOT_FOUND, 'could not find resource ' + resources + ' with id ' + id);

    db.deleteById(data, entity.id);

    err.raise(res, err.OK, 'record successfully deleted');
  });

};

function getRoutes(root) {
 // regular expression: /\/api\/
  var rootRegExp = root.replace(/\//g, '\\/'); // escape slashes

 // regular expression: /\/api\/ping
  var pingRegExp = rootRegExp + 'ping'; // ping

 // regular expression: /\/api\/(.*)
  var resourcesRegExp = rootRegExp + '(.*)'; // the resource path

 // regular expression: /\/api\/(.*)\/(\d+)
  var byIdRegExp = resourcesRegExp + '\\/(\\d+)';

 // regular expression: /\/api\/(.*)\/count
  var countRegExp = resourcesRegExp + '\\/count';

  return {
    ping      : new RegExp(pingRegExp),
    resources : new RegExp(resourcesRegExp),
    byId      : new RegExp(byIdRegExp),
    count     : new RegExp(countRegExp)
  };

};

module.exports = initController;