let connection_test = require("./connection_test");
let server = require("./server");
let serverConfig = require('../test/testutil').serverConfig();

module.exports = function(callback){
  server.listen(serverConfig.serverPort, function(){
    console.log("STARTED TEST rest server @ http://" + serverConfig.serverAddress + ':' + serverConfig.serverPort);
    if(typeof callback === 'function')
      callback();
  });
};

require("./runserver.js")(connection_test, server);
