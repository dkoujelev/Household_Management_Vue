let restify = require("restify");
let server = restify.createServer();

const corsMiddleware = require('restify-cors-middleware');

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['API-Token'],
    exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));

server.listen(9000, function(){
    console.log("starting rest server");
});

module.exports = server;

