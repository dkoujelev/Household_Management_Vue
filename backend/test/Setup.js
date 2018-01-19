let fs = require('fs');
let connection = require('../REST/connection_test');

let sql_statements = fs.readFileSync('backend/test/clearDB.sql','utf8');

before((done) => {
  require("../REST/runserver_test")(() => done());
});

beforeEach((done) => {
  // Ekstra sikkerhetssjekk - ikke clear basen hvis vi ikke har valgt testbasen.
  // Det kan være at prod-basen er valgt ved en feil.
  if(connection.config.database === 'oddbjool'){
    connection.query(sql_statements, [], (err, rows, fields) => {
      console.log("Cleared test database.");
      done();
    });
  }
});


