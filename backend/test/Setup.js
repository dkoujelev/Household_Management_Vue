let clearDB = require('./clearDB');
let clearLogins = require('./testutil').clearLogins;
let axios = require('axios');
let auth = require('../REST/auth');

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

axios.defaults.withCredentials = true;

before((done) => {
  require("../REST/runserver_test")(() => done());
});

after(() => {
  clearLogins();
  return clearDB();
});
