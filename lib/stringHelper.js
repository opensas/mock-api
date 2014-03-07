var s = {

  contains: function(text, contained) {
    text = text.toString();
    contained = contained.toString();
    return (text.indexOf(contained) !== -1);
  },

  startsWith: function(text, prefix) {
    text = text.toString();
    prefix = prefix.toString();
    return (text.substr(0, prefix.length) === prefix);
  },

  endsWith: function(text, sufix) {
    text = text.toString();
    sufix = sufix.toString();
    return (text.substr(text.length - sufix.length) === sufix);
  },

  withPrefix: function(text, prefix, sufix) {
    var res = s.startsWith(text, prefix) ? text : prefix + text;
    if (sufix!==undefined) res = s.withSufix(res, sufix);
    return res;
  },

  withSufix: function(text, sufix) {
    return s.endsWith(text, sufix) ? text : text + sufix;
  }

};

module.exports = s;
