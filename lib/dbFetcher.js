var _    = require('lodash');
var fs   = require('fs');
var path = require('path');

var self = {

  urlRoot: undefined,

  fsRoot: undefined,

  jsonFilename: 'data.json',
  jsFilename: 'data.js',

  data: {},

  fetch: function(req) {

    var urlPath = _.isString(req) ? req : req.path;
    if (!urlPath) return null;

    // normalize trailing slash
    urlPath = path.join(urlPath, '.');

    // already fetched, just return a copy
    if (_.has(self.data, urlPath)) return self.data[urlPath];

    // get rid of the urlRoot
    var fsPath = urlPath.substr(self.urlRoot.length);

    // append the fsRoot
    var fsJsonFile = path.join(self.fsRoot, fsPath, self.jsonFilename);
    var fsJsFile = path.join(self.fsRoot, fsPath, self.jsFilename);

    var data;

    // first try with a node module
    if (fs.existsSync(fsJsFile)) {
      data = require(fsJsFile);

    // then try with the json file
    } else if (fs.existsSync(fsJsonFile)) {
      var content = fs.readFileSync(fsJsonFile);
      data = JSON.parse(content);

    // not found
    } else {
      return null;
    }

    self.data[urlPath] = data;

    return data;
  }

};

module.exports = self;
