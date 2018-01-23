let connection_prod = require('./connection_prod');
let server = require("./server");

server.listen(9000, function(){
  console.log("STARTED PROD rest server! :)");
});

require("./runserver.js")(connection_prod, server);
