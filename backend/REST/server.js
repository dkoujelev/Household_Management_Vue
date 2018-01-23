let restify = require("restify");
let CookieParser = require('restify-cookies');
let auth = require('./auth');

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

server.loginEnabled = true;

server.use((req, res, next) => {
  if(server.loginEnabled){
    let approved = ['/rest/login','/rest/loggedIn','/rest/logout'];
    if(!approved.includes(req.getPath()) && !auth.checkThatSessionExists(req,res)){
      return next(false);
    }
  }
  return next();
});

module.exports = server;

