let clearDB = require('./clearDB');

before((done) => {
  require("../REST/runserver_test")(() => done());
});

after(done => {
  clearDB();
  done();
});
