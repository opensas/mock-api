var _ = require('lodash');

var clientes = require('../data.js');

module.exports = _.filter(clientes, function(cliente) {
  return cliente.edad < 21;
});
