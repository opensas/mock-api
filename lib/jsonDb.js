var db = require('../lib/dbHelper');
var _  = require('lodash');

var dao = {

  name: undefined,

  data: undefined,

  options: undefined,

  init: function(options, moreOptions) {

    var opts = {};

    if (_.isString(options)) {
      opts.root = options;
      options = {};
    }

    _.assign(opts, options, moreOptions);

    dao.options = opts;
  },

  findById: function(id) {

  },

  nextId: function() {

  },

  deleteById: function(id) {

  },

  add: function(newModel) {

  },

  update: function(originalModel, newModel) {

  },

  validate: function(isNew) {

  }
};
