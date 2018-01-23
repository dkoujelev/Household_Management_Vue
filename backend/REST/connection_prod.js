let mysql = require('mysql');

module.exports = mysql.createPool({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'g_tdat2003_t01',
    password: '0YfHKz2G',
    database: 'g_tdat2003_t01',
    multipleStatements: true
  });
