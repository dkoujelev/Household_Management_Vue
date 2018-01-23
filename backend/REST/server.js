let restify = require("restify");
let CookieParser = require('restify-cookies');
let auth = require('./auth');
let mysql = require('mysql');

module.exports = function(connection){

  let server = restify.createServer();
  server.use(CookieParser.parse);

  const corsMiddleware = require('restify-cors-middleware');

  const cors = corsMiddleware({
    origins: ['http://localhost:*'],
    allowHeaders: ['API-Token', 'sessionId'],
    exposeHeaders: ['API-Token-Expiry', 'sessionId'],
    credentials: true
  });

  server.pre(cors.preflight);
  server.use(cors.actual);
  server.use(restify.plugins.queryParser({
    mapParams: true
  }));
  server.use(restify.plugins.bodyParser({
    mapParams: true
  }));

  server.loginEnabled = false;

  server.use((req, res, next) => {
    connection.connection = mysql.createConnection(connection.connection_cfg);
    connection.connection.connect();
    //console.log("creating connection");
    if(server.loginEnabled){
      let approved = ['/rest/login','/rest/loggedIn','/rest/logout'];
      if(!approved.includes(req.getPath()) && !auth.checkThatSessionExists(req,res)){
        return next(false);
      }
    }
    return next();
  });

  server.on('after',(req,res) => {
    //console.log("destroying connection");
    connection.connection.destroy();
  });

  return server;
};

