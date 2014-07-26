// attention
// check http://webapplog.com/express-js-and-mongoose-example-building-hackhall/

var express = require('express');
var app     = express();

// middleware
var serveStatic = require('serve-static')
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

// config
var config = require('./lib/utils/config');

app.use(serveStatic(__dirname + '/public'));    // set the static files location /public/img will be /img for users
app.use(logger('dev'));                         // log every request to the console
app.use(bodyParser.json());                     // pull information from html in POST
app.use(methodOverride());                      // simulate DELETE and PUT

var initController = require('./controllers/mainController');

// register main controller endpoints
initController(app, config);

app.listen(config.port);
console.log('app started, listening on port ' + config.port);

module.exports = app;
