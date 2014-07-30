var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var jsonHelper  = require('../utils/jsonHelper');

var self = {

  dataFolder: undefined,

  jsonFilename: 'data.json',
  jsFilename: 'data.js',

  data: {},

  /**
   * Strips leading and trailing slashes from the resource name
   * 
   * @param {String} resource
   */
  normalizeResource: function(resource) {
    return resource.
      replace(/^\/*/, '').
      replace(/\/*$/, '');
  },
  
  fetch: function(resource) {

    if (!resource) return null;

    resource = self.normalizeResource(resource);

    // already fetched, just return a copy
    if (_.has(self.data, resource)) return self.data[resource];

    // append the fsRoot
    var fsJsonFile  = path.join(self.dataFolder, resource, self.jsonFilename);
    var fsJsFile    = path.join(self.dataFolder, resource, self.jsFilename);

    var data;

    // first try with a node module
    if (fs.existsSync(fsJsFile)) {
      data = require(fsJsFile);

    // then try with the json file
    } else if (fs.existsSync(fsJsonFile)) {
      data = jsonHelper.requireJson(fsJsonFile);

    // not found
    } else {
      return null;
    }

    self.data[resource] = data;

    return data;
  }

};

module.exports = self;
