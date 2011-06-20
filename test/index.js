test = require(__dirname + '/../lib');
var testContext = new test.Context("test");

if(!module.parent) {
  var fs = require('fs');
  fs.readdir(__dirname, function(err, files) {
    if(err) {
      throw err;
    }
    files.forEach(function(file) {
      require(__dirname + "/" + file.replace(".js",""));
    })
  })
}

module.exports = {
  context : testContext
}
