let clearDB = require('./clearDB');
let axios = require('axios');
let auth = require('../REST/auth');

before((done) => {

  // We have to FAKE LOGIN against REST, or most tests will produce 404.
  // Extreme hack.

  let sessionId = auth.newSession("fake user");
  axios.defaults.headers.common['cookie'] = 'sessionId='+sessionId;
  require("../REST/runserver_test")(() => done());
});

after(done => {
  clearDB();
  done();
});
