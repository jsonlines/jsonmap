var ndjson = require('ndjson')
var pumpify = require('pumpify')
var through = require('through2')
var split = require('split2')

module.exports = function(func, opts) {
  if (!opts) opts = {}
  var transform = createFunctionStream(func, opts)
  if (opts.parse === false) return pumpify.obj(split(), transform)
  return pumpify.obj(ndjson.parse(), transform)
}

module.exports.createFunctionStream = createFunctionStream
function createFunctionStream (func, opts) {
  if (!opts) opts = {}
  var compiled
  if (typeof func !== 'function') {
    var funcStr = func + ';\n return this;'
    if (func[0] === '{' || func[0] === '`') funcStr = 'var t = ' + func + ';\n return t;'
    compiled = new Function('require', '_', funcStr)
  } else if (opts.through) {
    return through.obj(func)
  } else {
    compiled = function (require, obj) {
      return func.call(obj, require, obj) || this // in case the function just mutates `this` w/o returning.
    }
  }

  function transform (obj, enc, next) {
    var out = compiled.call(obj, require, obj)
    this.push(out)
    next()
  }

  return through.obj(transform)
}
