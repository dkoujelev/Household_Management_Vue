let mysql = require('mysql');

module.exports = mysql.createPool({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'oddbjool',
    password: 'kYVZd1cK',
    database: 'oddbjool',
    multipleStatements: true
  });
