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

  endsWith: function(text, suffix) {
    text = text.toString();
    suffix = suffix.toString();
    return (text.substr(text.length - suffix.length) === suffix);
  },

  withPrefix: function(text, prefix, suffix) {
    var res = s.startsWith(text, prefix) ? text : prefix + text;
    if (suffix!==undefined) res = s.withSuffix(res, suffix);
    return res;
  },

  withSuffix: function(text, suffix) {
    return s.endsWith(text, suffix) ? text : text + suffix;
  }

};

module.exports = s;
