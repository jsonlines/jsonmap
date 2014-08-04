var ldj = require('ldjson-stream')
var pumpify = require('pumpify')
var through = require('through2')

module.exports = function(func) {
  var compiled = new Function(func + ';\nreturn this;')
  
  return pumpify.obj(ldj.parse(), through.obj(transform))
  
  function transform(obj, enc, next) {
    var out = compiled.call(obj, obj)
    this.push(out)
    next()
  }
}
