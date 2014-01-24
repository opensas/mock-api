var _ = require('underscore');

module.exports = {

  byId: function(array, id) {
    return _(array).findWhere({ id: id }) || null;
  },

  deleteById: function(array, id) {
    for (var index = 0; index < array.length; index++) {
      if (array[index].id === id) {
        array.splice(index, 1);     // remove the element
        return true;
      }
    }
    return false;       // could not delete it, item not found
  },

  nextId: function(array) {
    var next = 0;

    _(array).each(function(element) {
      if (element.id > next) next = element.id;
    });

    return next + 1;

    // if (array.length === 0) return 1;

    // return _.chain(array)
    //   .map(function(item) { return item.id }) // an array of ids
    //   .max()   // get the max id
    //   .value() // get the value
    //   + 1;     // add one

    // return _(array).max(function(item) {
    //   return item.id;
    // }).id + 1;
  }

};
