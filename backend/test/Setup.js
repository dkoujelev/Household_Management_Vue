let clearDB = require('./clearDB');
let clearLogins = require('./testutil').clearLogins;
let axios = require('axios');
let auth = require('../REST/auth');

let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

let chaiSubset = require('chai-subset');
let server = require("../REST/server");
chai.use(chaiSubset);

let chaiDateString = require('chai-date-string');
chai.use(chaiDateString);

axios.defaults.withCredentials = true;

before((done) => {
  server.loginEnabled = false;
  require("../REST/runserver_test")(() => done());
});

after(() => {
  return clearDB();
});
