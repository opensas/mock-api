// attention
// check http://webapplog.com/express-js-and-mongoose-example-building-hackhall/

var express = require('express');
var app     = express();

// config
var config      = require('./config');

app.configure(function() {
  app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
  app.use(express.logger('dev'));                 // log every request to the console
  app.use(express.bodyParser());                  // pull information from html in POST
  app.use(express.methodOverride());              // simulate DELETE and PUT
});

var initController = require('./controllers/mainController');

// register main controller endpoints
initController(app, config);

app.listen(config.port);
console.log('app started, listening on port ' + config.port);

module.exports = app;