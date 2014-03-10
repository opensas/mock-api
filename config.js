var _       = require('lodash');
var path    = require('path');
var string  = require('./lib/utils/stringHelper');

var root = __dirname;

// overwrite this to change default configuration
var config = {
  port: 3000,
  apiRoot: '/api',
  dataFolder: './data'
};

var defaults = {
  port: 3000,
  apiRoot: '/api',
  dataFolder: './data'
};

config.root = root;

_.defaults(config, defaults);

// not and absolute path
if (!string.startsWith(config.dataFolder, '/')) {
  config.dataFolder = path.join(config.root, config.dataFolder);
}

// ensure separators are present
config.apiRoot    = string.withPrefix(config.apiRoot, '/', '/');
config.dataFolder = string.withSuffix(config.dataFolder, path.sep);

// #TODO: validate dataFolder is present!

module.exports = config;



