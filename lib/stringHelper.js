var stringHelper = {

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
  }
  
};

module.exports = stringHelper;
