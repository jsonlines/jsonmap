module.exports = function(data, enc, next){
  var self = this;
  if (data.dog == 5) {
    self.push(data)
  }

  process.nextTick(function(){
    data.dog++
    self.push(data)
    next()
  })
}