var ldj = require('ldjson-stream')
var pumpify = require('pumpify')
var through = require('through2')

module.exports = function(func) {
  var transform = createFunctionStream(func)
  return pumpify.obj(ldj.parse(), transform) 
}

module.exports.createFunctionStream = createFunctionStream

function createFunctionStream(func) {
  var funcStr = func + ';\n return this;'
  if (func[0] === '{') funcStr = 'var that = ' + func + ';\n return that;'
  var compiled = new Function(funcStr)
  
  function transform(obj, enc, next) {
    var out = compiled.call(obj, obj)
    this.push(out)
    next()
  }

  return through.obj(transform)
}