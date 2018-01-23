let fs = require('fs');
let sql_statements = fs.readFileSync('backend/test/clearDB.sql','utf8');
let connection = require('../REST/connection_test');
let axios = require('axios');
let auth = require('../REST/auth');
let mysql = require('mysql');


module.exports = {
  clearDB(){
    // Ekstra sikkerhetssjekk - ikke clear basen hvis vi ikke har valgt testbasen.
    // Det kan være at prod-basen er valgt ved en feil.
    return new Promise((resolve, reject) => {
      //if (connection.connection_cfg.database === 'oddbjool') {
        connection.query(sql_statements, [], (err, rows, fields) => {
          resolve();
        });
      //else
        //reject("Kan ikke cleare database " + connection.connection_cfg.database );
    });
  }

};

