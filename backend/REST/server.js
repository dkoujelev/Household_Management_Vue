let restify = require("restify");
let CookieParser = require('restify-cookies');
let auth = require('./auth');
let connection_prod = require('./connection_prod');
let mysql = require('mysql');

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

server.loginEnabled = true; //true / false husk å bytt

server.use((req, res, next) => {
  connection_prod.connection = mysql.createConnection(connection_prod.connection_cfg);
  connection_prod.connection.connect();
  console.log("creating connection");
  if(server.loginEnabled){
    let approved = ['/rest/login','/rest/loggedIn','/rest/logout'];
    if(!approved.includes(req.getPath()) && !auth.checkThatSessionExists(req,res)){
      return next(false);
    }
  }
  return next();
});

server.on('after',(req,res) => {
  console.log("destroying connection");
  connection_prod.connection.destroy();
});



module.exports = server;

