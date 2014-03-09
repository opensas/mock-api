// mocha test
var root  = __dirname + '/../../';
var _     = require('lodash');

var db  = require(root + 'lib/db/dbConditions');
var op  = db._operators;

var should = require('chai').should();

describe('dbConditions module', function() {

  describe('dbConditions._parse', function() {

    var conditions = {
      'field1'            : 'value1',
      'field2=value2'     : '',
      'field3:value3'     : '',
      'field4<>value4'    : '',
      'field5'            : '3..5',
      'field6:3..5'       : '',
      'field7>value7'     : '',
      'field8>=value8'    : '',
      'field9<value9'     : '',
      'field10<=value10'  : '',
      'field11'           : '*value11*',
      'field12'           : 'value12*',
      'field13'           : '*value13',
      'field14'           : 'val_a;val_b;val_c',
      'field15:val_a;val_b;val_c': '',
    };

    var negated = {
      'field1!'           : 'value1',
      'field2!=value2'    : '',
      'field3!:value3'    : '',
      'field4!value4'     : '',
      'field5!<>value5'   : '',
      'field6!'           : '3..5',
      'field7!:3..5'      : '',
      'field8!3..5'       : '',
      'field9!>value9'    : '',
      'field10!>=value10' : '',
      'field11!<value11' : '',
      'field12!<=value12' : '',
      'field13!'          : '*value13*',
      'field14!*value14*' : '',
      'field15!'          : 'value15*',
      'field16!'          : '*value16',
      'field17!'          : 'val_a;val_b;val_c',
      'field18!val_a;val_b;val_c': '',
    };

    var copy = _.cloneDeep(conditions);

    // defensive test
    // original should NEVER be modified
    afterEach(function() {
      conditions.should.eql(copy);
    });

    it('should parse the specified conditions', function() {
      var parsed = db._parse(conditions);
      parsed.should.eql([
        { field: 'field1',  negated: false, operator: op.EQUAL,            values: ['value1'] },
        { field: 'field2',  negated: false, operator: op.EQUAL,            values: ['value2'] },
        { field: 'field3',  negated: false, operator: op.EQUAL,            values: ['value3'] },
        { field: 'field4',  negated: false, operator: op.NOT_EQUAL,        values: ['value4'] },
        { field: 'field5',  negated: false, operator: op.BETWEEN,          values: ['3', '5'] },
        { field: 'field6',  negated: false, operator: op.BETWEEN,          values: ['3', '5'] },
        { field: 'field7',  negated: false, operator: op.GREATER,          values: ['value7'] },
        { field: 'field8',  negated: false, operator: op.GREATER_OR_EQUAL, values: ['value8'] },
        { field: 'field9',  negated: false, operator: op.LESS,             values: ['value9'] },
        { field: 'field10', negated: false, operator: op.LESS_OR_EQUAL,    values: ['value10'] },
        { field: 'field11', negated: false, operator: op.CONTAINS,         values: ['value11'] },
        { field: 'field12', negated: false, operator: op.BEGINS,           values: ['value12'] },
        { field: 'field13', negated: false, operator: op.ENDS,             values: ['value13'] },
        { field: 'field14', negated: false, operator: op.ONE_OF,           values: ['val_a', 'val_b', 'val_c'] },
        { field: 'field15', negated: false, operator: op.ONE_OF,           values: ['val_a', 'val_b', 'val_c'] },
      ]);
    });

    it('should parse the specified negated conditions', function() {
      var parsed = db._parse(negated);
      parsed.should.eql([
        { field: 'field1',  negated: true, operator: op.EQUAL,            values: ['value1'] },
        { field: 'field2',  negated: true, operator: op.EQUAL,            values: ['value2'] },
        { field: 'field3',  negated: true, operator: op.EQUAL,            values: ['value3'] },
        { field: 'field4',  negated: true, operator: op.EQUAL,            values: ['value4'] },
        { field: 'field5',  negated: true, operator: op.NOT_EQUAL,        values: ['value5'] },
        { field: 'field6',  negated: true, operator: op.BETWEEN,          values: ['3', '5'] },
        { field: 'field7',  negated: true, operator: op.BETWEEN,          values: ['3', '5'] },
        { field: 'field8',  negated: true, operator: op.BETWEEN,          values: ['3', '5'] },
        { field: 'field9',  negated: true, operator: op.GREATER,          values: ['value9'] },
        { field: 'field10', negated: true, operator: op.GREATER_OR_EQUAL, values: ['value10'] },
        { field: 'field11', negated: true, operator: op.LESS,             values: ['value11'] },
        { field: 'field12', negated: true, operator: op.LESS_OR_EQUAL,    values: ['value12'] },
        { field: 'field13', negated: true, operator: op.CONTAINS,         values: ['value13'] },
        { field: 'field14', negated: true, operator: op.CONTAINS,         values: ['value14'] },
        { field: 'field15', negated: true, operator: op.BEGINS,           values: ['value15'] },
        { field: 'field16', negated: true, operator: op.ENDS,             values: ['value16'] },
        { field: 'field17', negated: true, operator: op.ONE_OF,           values: ['val_a', 'val_b', 'val_c'] },
        { field: 'field18', negated: true, operator: op.ONE_OF,           values: ['val_a', 'val_b', 'val_c'] },
      ]);
    });

  });

});
