let connection_test = require("./connection_test");
let server = require("./server");

module.exports = function(callback){
  server.listen(9100, function(){
    console.log("STARTED TEST rest server! :)");
    if(typeof callback === 'function')
      callback();
  });
};

require("./runserver.js")(connection_test, server);
