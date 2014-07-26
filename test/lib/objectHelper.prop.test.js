// mocha test
var root = __dirname + '/../../';
var o = require(root + 'lib/utils/objectHelper');

var assert = require('assert');
describe('objectHelper module', function() {

  describe('objectHelper.prop', function() {

    var o1 = {
      name: 'john',
      address: {
        street: 'saint john',
        number: 222,
        location: {
          lat: 23.4,
          lon: 43.5
        }
      }
    };

    var o2 = [
      { name: 'john', children: [ { name: 'johny1' }, { name: 'johny2' } ] },
      { name: 'paul', children: [ { name: 'pauly1' }, { name: 'pauly2' } ] }
    ]

    it('should work with simple properties', function() {
      assert.equal(o.prop(o1, 'name'), 'john');
    });

    it('should work with nested properties', function() {
      var expected = {
        'name': 'john',
        'address.street': 'saint john',
        'address.number': 222,
        'address.location.lat': 23.4,
        'none': undefined,
        'address.none': undefined,
        'address.location.': undefined
      }
      for (prop in expected) {
        assert.equal(o.prop(o1, prop), expected[prop]);
      }
    });

    it('should work with arrays as properties', function() {
      var expected = {
        '[0].name': 'john',
        '0.name': 'john',
        '[0].children[0].name': 'johny1',
        '[0].children[1].name': 'johny2',
        '[1].name': 'paul',
        '[1].children[0].name': 'pauly1',
        '[1].children[1].name': 'pauly2',
        '1.children.1.name': 'pauly2',
        '[1].children[3].name': undefined,
        '[2].name': undefined
      }
      for (prop in expected) {
        assert.equal(o.prop(o2, prop), expected[prop]);
      }
    });

  });

});
