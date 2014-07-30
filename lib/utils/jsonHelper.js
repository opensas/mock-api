var fs   = require('fs');
var path = require('path');

var j = {
  requireJson: function(pathname, filename) {

    if (!pathname) return null;
    
    // if two parameters are passed
    // the first is the pathname and the second is the file
    if (filename) { 
      filename = path.join(pathname, filename);
    } else {
      filename = pathname;
    }
    
    if (!fs.existsSync(filename)) return null;
    
    try {
      var content = fs.readFileSync(filename);
      var data = JSON.parse(content);
      return data;
    } catch (e) {
      return null;
    }
  }
};

module.exports = j;