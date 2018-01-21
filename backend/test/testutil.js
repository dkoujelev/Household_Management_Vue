let fs = require('fs');
let sql_statements = fs.readFileSync('backend/test/clearDB.sql','utf8');
let connection = require('../REST/connection_test');
let axios = require('axios');
let auth = require('../REST/auth');

module.exports = {

  sessionId: null,

  clearDB(){
    // Ekstra sikkerhetssjekk - ikke clear basen hvis vi ikke har valgt testbasen.
    // Det kan være at prod-basen er valgt ved en feil.
    return new Promise((resolve, reject) => {
      if (connection.config.database === 'oddbjool') {
        connection.query(sql_statements, [], (err, rows, fields) => {
          resolve();
        });
      }
      else
        reject("Kan ikke cleare database " + connection.config.database);
    });
  },

  // We have to FAKE LOGIN against REST, or most tests will produce 404.
  // Extreme hack.
  fakeLogin(){
    this.sessionId = auth.newSession({epost: 'fakeuser@fake.fake'});
    axios.defaults.headers.common['cookie'] = 'sessionId=' + this.sessionId;
  },

  clearLogins(){
    auth.clearLogins();
    axios.defaults.headers.common['cookie'] = '';
  }

};

