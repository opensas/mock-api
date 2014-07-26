// mocha test
var root = __dirname + '/../../';
var db = require(root + 'lib/db/dbHelper');

var _ = require('lodash');

var should = require('chai').should();

describe('dbHelper module', function() {

  describe('dbHelper.orderBy', function() {

    var original = [
      { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
      { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
      { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
      { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
      { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
      { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
      { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
    ];

    var copy = _.cloneDeep(original);

    // defensive test
    // original should NEVER be modified
    afterEach(function() {
      original.should.eql(copy);
    });

    it('it should order by a string property', function() {
      var data = db.orderBy(original, 'name');
      data.should.have.members(original);
      data.should.eql([
        { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
        { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
        { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
        { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
        { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
        { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
      ]);

    });

    it('it should order by a number property', function() {
      var data = db.orderBy(original, 'age');
      data.should.have.members(original);
      data.should.eql([
        { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
        { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
        { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
        { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
        { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
        { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
      ]);

    });

    it('it should order by a nested property', function() {
      var data = db.orderBy(original, 'kind.id');
      data.should.have.members(original);
      data.should.eql([
        { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
        { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
        { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
        { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
        { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
      ]);

      data = db.orderBy(original, 'kind.name');
      data.should.have.members(original);
      data.should.eql([
        { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
        { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
        { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
        { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
        { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
      ]);

    });

    it('it should order by an array property', function() {
      var data = db.orderBy(original, 'priorities[0]');
      data.should.have.members(original);
      data.should.eql([
        { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
        { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
        { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
        { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
        { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
      ]);

      data = db.orderBy(original, 'priorities[1]');
      data.should.have.members(original);
      data.should.eql([
        { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
        { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
        { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
        { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
        { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
      ]);

      data = db.orderBy(original, 'priorities[2]');
      data.should.have.members(original);
      data.should.eql([
        { name: 'f', age: 60, kind: { id: 3, name: 'third kind'}, priorities: [3, 2, 1] },
        { name: 'e', age: 30, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'g', age: 70, kind: { id: 1, name: 'first kind'}, priorities: [1, 2, 3] },
        { name: 'a', age: 10, kind: { id: 4, name: 'fourth kind'}, priorities: [6, 5, 4] },
        { name: 'c', age: 20, kind: { id: 2, name: 'second kind'}, priorities: [4, 5, 6] },
        { name: 'b', age: 40, kind: { id: 3, name: 'third kind'}, priorities: [9, 8, 7] },
        { name: 'd', age: 50, kind: { id: 5, name: 'fifth kind'}, priorities: [7, 8, 9] },
      ]);

    });

  });

});
