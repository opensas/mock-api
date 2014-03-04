var path = require('path')

var p = {

  join: path.join,

  withSeps: function(url) {
    return p.withFirstSep(p.withLastSep(url));
  },

  withFirstSep: function(url) {
    return path.join('_', url).substring(1);
  },

  withLastSep: function(url) {
    var tmpUrl = path.join(url, '_');
    return tmpUrl.substring(0, tmpUrl.length-1);
  }

};

module.exports = p;