var convert = {

  toNumber: function(value) {
    if (!convert.isNumeric(value)) return undefined;
    return parseInt(value);
  },

  isNumeric: function(value) {
    return !isNaN(value);
  }

};

module.exports = convert;
