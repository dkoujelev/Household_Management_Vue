let restify = require("restify");
let CookieParser = require('restify-cookies');
let auth = require('./auth');
let mysql = require('mysql');
let serverConfig = require('./serverConfig');

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

server.use((req, res, next) => {
    //console.log("creating connection");

    if(!serverConfig.loginEnabled)
      return next();

    let approved = ['/rest/login','/rest/loggedIn','/rest/logout','/rest/forgottenPassword'];
    let is_posting_new_user = (req.getRoute().method == 'POST' && req.getPath().startsWith('/rest/bruker'));
    let brukerepost = req.getPath().startsWith('/rest/brukerepost/');
    console.log(req.getRoute().method + " " + req.getPath());


    if(!(approved.includes(req.getPath()) || is_posting_new_user || brukerepost) && !auth.checkThatSessionExists(req,res)){
      return next(false);
    }

    return next();
});

// server.on('after',(req,res) => {
// });

module.exports = server;

