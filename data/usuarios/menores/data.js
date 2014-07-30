var _ = require('lodash');
var requireJson = require('../../../lib/utils/jsonHelper.js').requireJson;

var usuarios = requireJson(__dirname, '../data.json');

module.exports = _.filter(usuarios, function(usuario) {
  return usuario.edad < 21;
});
