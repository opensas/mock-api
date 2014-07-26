var objectHelper = {

  /*
  *
  * Multilevel property evaluation
  *
  * Example:
  *
  * o = {
  *   name: 'John',
  *   address: {
  *     street: 'Saint John',
  *     number: 222
  *   }
  * };
  * objectHelper.prop(o, 'name') // --> 'John'
  * objectHelper.prop(o, 'xxx') // --> undefined
  * objectHelper.prop(o, 'address.number') // --> 222
   */
  prop: function(obj, prop) {

    // no es una propiedad anidada
    if (!/[\.\[\]]/.test(prop)) return obj[prop];

    // translates array notation to property notation
    // indexToProp("person1[23].father.children[34].surname")
    // // --> person1.23.father.children.34.surname
    var indexToProp = function(prop) {
      return prop.replace(/^\[/, '').replace(/\[/g, '.').replace(/\]/g, '');
    };

    var props = indexToProp(prop).split('.');
    var currentProp;
    for (var i=0; i<props.length; i++) {
      currentProp = props[i];
      if (!obj.hasOwnProperty(currentProp)) return undefined;
      obj = obj[currentProp];
    }
    return obj;
  }

};

module.exports = objectHelper;
