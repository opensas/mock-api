// attention
// check http://webapplog.com/express-js-and-mongoose-example-building-hackhall/

var express = require('express');
var app     = express();

app.configure(function() {
  app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
  app.use(express.logger('dev'));                 // log every request to the console
  app.use(express.bodyParser());                  // pull information from html in POST
  app.use(express.methodOverride());              // simulate DELETE and PUT
});

// utils
var err        = require('./lib/err');
var db         = require('./lib/dbHelper');
var httpStatus = require('./lib/httpStatus');
var _          = require('lodash');

var fs         = require('fs');
var path       = require('./lib/pathHelper');

var dbFetcher  = require('./lib/dbFetcher');

// config
var config = require('./config');
var port        = config.port;
var root        = path.withSeps(config.apiRoot);
var dataFolder  = path.withLastSep(config.dataRoot);

app.get(root + 'ping', function(req, res) {
  res.send('pong');
});

var data = {};

// check this: https://npmjs.org/package/readdir
// data.usuarios = require('./data/usuarios/data.js');

dbFetcher.urlRoot = root;
dbFetcher.fsRoot = path.join(__dirname, dataFolder);

app.get(root + '*/count', function(req, res, next) {

  // get rid of the /count
  var path = req.path.replace(/\/count$/, '');

  var data = dbFetcher.fetch(path);
  if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + req.path);

  var result = db.query(data, req, {len: -1}); // force no pagination
  res.json(result.length);

});


//app.get(root + 'usuarios/:id', function(req, res) {
//
//  var entity = app.findById(req, res, data.usuarios);
//
//  res.json(entity);
//});

// app.get(root + '*/:id(\\d+)', function(req, res, next) {
// app.get('/api/*/\\d+', function(req, res, next) {
app.get(/\/api\/(.*)\/(\d+)/, function(req, res, next) {

  console.log('fetching by id');

  // get rid of the /id
  var path = req.path.replace(/\/(\d+)$/, '');
  var id = req.params[1];

  var data = dbFetcher.fetch(path);
  if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + req.path);

  var entity = app.findById(id, res, data);

  res.json(entity);
});

app.get(root + '*', function(req, res, next) {

  var data = dbFetcher.fetch(req);
  if (data===null) err.raise(res, err.NOT_FOUND, 'could not find ' + req.path);

  var result = db.query(data, req);
  res.json(result);

});

app.put(root + 'usuarios/:id', function(req, res) {

  var entity = app.findById(req, res, data.usuarios);

  var updateEntity = req.body;
  delete updateEntity.id;         // prevent id from being modified

  _.extend(entity, updateEntity);    // WARNING: modifying data.usuarios

  res.json(entity);
});

//app.post(root + 'usuarios', function(req, res) {
//
//  var id = db.nextId(data.usuarios);  // #todo: return error if not found
//
//  var newEntity = req.body;
//  newEntity.id = id;
//
//  data.usuarios.push(newEntity);
//
//  res.json(httpStatus.CREATED, newEntity);
//});
//
//app.delete(root + 'usuarios/:id', function(req, res) {
//
//  var entity = app.findById(req, res, data.usuarios);
//
//  db.deleteById(data.usuarios, entity.id);
//
//  err.raise(res, err.OK, 'record successfully deleted');
//});

app.findById = function(req, res, data, entityName) {
  var convert = require('./lib/convert');

  entityName = entityName || 'record';

  var id = req.params ? req.params.id : req;
  id = convert.toNumber(id);

  if (!id) err.raise(res, err.BAD_REQUEST, 'id should be a valid number');

  var entity = db.byId(data, id);
  if (!entity) {
    err.raise(res, err.NOT_FOUND, 'could not find ' + entityName + ' with id ' + id.toString());
  }

  return entity;
};

app.listen(port);
console.log('app started, listening on port ' + port);

module.exports = app;
