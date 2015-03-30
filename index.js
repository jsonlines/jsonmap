var ldj = require('ldjson-stream')
var pumpify = require('pumpify')
var through = require('through2')

module.exports = function(func) {
  var transform = createFunctionStream(func)
  return pumpify.obj(ldj.parse(), transform) 
}

module.exports.createFunctionStream = createFunctionStream

function createFunctionStream(func) {
  var compiled;
  if(typeof func !== 'function') {
    var funcStr = func + ';\n return this;'
    if (func[0] === '{' || func[0] === '`') funcStr = 'var t = ' + func + ';\n return t;'
    compiled = new Function(funcStr)
  }
  else {
    compiled = function(obj) {
      return func.call(this, obj)
        || this; // in case the function just mutates `this` w/o returning.
    };
  }
  
  function transform(obj, enc, next) {
    var out = compiled.call(obj, obj)
    this.push(out)
    next()
  }

  return through.obj(transform)
}
