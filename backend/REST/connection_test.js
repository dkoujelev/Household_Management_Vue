let mysql = require("mysql");

let connection_test = {
  connection_cfg: {
    host: 'mysql.stud.iie.ntnu.no',
    user: 'oddbjool',
    password: 'kYVZd1cK',
    database: 'oddbjool',
    multipleStatements: true
  },
  connection: null
};

module.exports = connection;
