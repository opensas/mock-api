/*
var tests = [
  "id=3",
  "type.id=3",
  "idea.type.id<>1",
  "idea.type.id=1..3",
  "idea.type.id=1..",
  "idea.type.id=..3",
  "idea.type.id>=3",
  "idea.type.id=3;4",
  "idea.type.name=*test*",
  "idea.type.name=*test",
  "idea.type.name=test*"
];
*/

var _             = require('lodash');
var convert       = require('../utils/convert');
var stringHelper  = require('../utils/stringHelper');

var operators = {
  EQUAL:            'EQUAL',
  NOT_EQUAL:        'NOT_EQUAL',
  BETWEEN:          'BETWEEN',
  GREATER:          'GREATER',
  GREATER_OR_EQUAL: 'GREATER_OR_EQUAL',
  LESS:             'LESS',
  LESS_OR_EQUAL:    'LESS_OR_EQUAL',
  CONTAINS:         'CONTAINS',
  BEGINS:           'BEGINS',
  ENDS:             'ENDS',
  ONE_OF:           'ONE_OF'
};

var simple_operators = {
  '='  : operators.EQUAL,
  ':'  : operators.EQUAL,
  '<>' : operators.NOT_EQUAL,
  '<'  : operators.LESS,
  '<=' : operators.LESS_OR_EQUAL,
  '>'  : operators.GREATER,
  '>=' : operators.GREATER_OR_EQUAL,
};

var BETWEEN_SEP = '..'
var ONE_OF_SEP = ';'

var parseSingle = function(condition) {

  var regExp = /^(\w*)(!?)(=|:|<>|<=|>=|<|>)?(.*)/;
  var parsed = regExp.exec(condition);

  if (parsed.length !==5) return null;

  var field     = parsed[1];
  var negated   = (parsed[2] === '!');
  var operator  = parsed[3];
  var values    = parsed[4];

  // if negated and no operator, asume operator is EQUAL
  if (negated && !operator) operator = '=';

  if (!field || !operator || !values) return null;

  if (operator === ':' || operator === '=') {

    // check for ONE_OF
    if (values.indexOf(ONE_OF_SEP) !== -1) {
      operator = operators.ONE_OF;
      values = values.split(ONE_OF_SEP);
      return {field: field, negated: negated, operator: operator, values: values};
    }

    // check for BETWEEN
    if (values.indexOf(BETWEEN_SEP) !== -1) {
      values = values.split(BETWEEN_SEP).splice(0,2);

      if (values[0] === '') {
        operator = operators.GREATER_OR_EQUAL;
        values = values.splice(0,1);
        return {field: field, negated: negated, operator: operator, values: values};

      } else if (values[1] === '') {
        operator = operators.LESS_OR_EQUAL;
        values = values.splice(1,1);
        return {field: field, negated: negated, operator: operator, values: values};

      } else {
        operator = operators.BETWEEN;
        return {field: field, negated: negated, operator: operator, values: values};
      }
    }

    // check for CONTAINS
    parsed = /^\*(.*)\*$/.exec(values);
    if (parsed) {
      operator = operators.CONTAINS;
      values = [parsed[1]];
      return {field: field, negated: negated, operator: operator, values: values};
    }

    // check for BEGINS
    parsed = /^(.*)\*$/.exec(values);
    if (parsed) {
      operator = operators.BEGINS;
      values = [parsed[1]];
      return {field: field, negated: negated, operator: operator, values: values};
    }

    // check for ENDS
    parsed = /^\*(.*)$/.exec(values);
    if (parsed) {
      operator = operators.ENDS;
      values = [parsed[1]];
      return {field: field, negated: negated, operator: operator, values: values};
    }

  }

  values = [values];

  // operator not recognized
  if (!simple_operators[operator]) return null;
  operator = simple_operators[operator];

  return {field: field, negated: negated, operator: operator, values: values};
};

var parse = function(conditions) {
  var conditions = _.omit(conditions, 'q', 'fields', 'order', 'sort', 'page', 'len');

  var parsed = _.map(conditions, function(value, key) {
    var condition = (value ==='' ? key : key + '=' + value);
    return parseSingle(condition);
  });

  return parsed;
};

var evaluateSingle = function(object, parsedCondition) {
  var value = object[parsedCondition.field];

  // error, object has no property named 'field'
  if (value === undefined) return false;

  var res     = false;
  var negated = parsedCondition.negated;
  var op      = parsedCondition.operator;
  var values  = parsedCondition.values;

  //if it's a string, use CONTAINS instead of EQUALS
  if (
      (op === operators.EQUAL || op === operators.NOT_EQUAL)
      && _.isString(value)
  ) {
    if (op === operators.NOT_EQUAL) negated = !negated;
    op = operators.CONTAINS;
  }

  // transform values to proper type for comparison
  if (_.isNumber(value)) {
    values = _.map(values, function(value) {
      return convert.toNumber(value);
    });
  } else {
    values = _.map(values, function(value) {
      return value.toString();
    });
  }

  switch (true) {
    case op === operators.EQUAL || op === operators.NOT_EQUAL:
      res = (value == values[0]);
      if (op === operators.NOT_EQUAL) res = !res;
      break;

    case op === operators.BETWEEN:
      res = (value >= values[0] && value <= values[1]);
      break;

    case op === operators.GREATER:
      res = (value > values[0]);
      break;

    case op === operators.GREATER_OR_EQUAL:
      res = (value >= values[0]);
      break;

    case op === operators.LESS:
      res = (value < values[0]);
      break;

    case op === operators.LESS_OR_EQUAL:
      res = (value <= values[0]);
      break;

    case op === operators.CONTAINS:
      res = stringHelper.contains(value, values[0]);
      break;

    case op === operators.BEGINS:
      res = stringHelper.startsWith(value, values[0]);
      break;

    case op === operators.ENDS:
      res = stringHelper.endsWith(value, values[0]);
      break;

    case op === operators.ONE_OF:
      res = _.contains(values, value);
      break;

    default:
      return false;
  }

  if (negated) res = !res;

  return res;
};

var evaluate = function(object, conditions) {
  for (var i=0; i<conditions.length; i++) {
    if (!evaluateSingle(object, conditions[i])) return false;
  }
  return true;
};

var apply = function(array, options) {
  var conditions = parse(options);

  return _.filter(array, function(data) {
    return evaluate(data, conditions);
  });

}

var dbConditions = {
  _operators:       operators,
  _parseSingle:     parseSingle,
  _parse:           parse,
  _evaluateSingle:  evaluateSingle,
  _evaluate:        evaluate,
  apply:            apply
};

module.exports = dbConditions;

/*
var c = require('./lib/dbConditions')
var query = { 'name:sas;juan;pablo':'', 'age>34': '' }
var conds = c._parse( query )
var cond = conds[1]
var data = [ { name: 'jose', age: 20 } , {name: 'juan', age: 40} ]

c._evaluateSingle(data[0], cond)
c._evaluateSingle(data[1], cond)

c._evaluate(data[0], cond)
c._evaluate(data[1], cond)

c.apply(data, query)
*/


