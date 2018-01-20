let mysql = require("mysql");

let connection = mysql.createConnection({
  host: 'mysql.stud.iie.ntnu.no',
  user: 'oddbjool',
  password: 'kYVZd1cK',
  database: 'oddbjool',
  multipleStatements: true
});

connection.connect();

module.exports = connection;
