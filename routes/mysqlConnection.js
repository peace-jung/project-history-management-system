const mysql = require('mysql');

module.exports = () => {
  return {
    init: () => {
      return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'history2',
        multipleStatements: true
      })
    },

    open: () => {
      connection.connect(function (err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
          return;
        }
        console.log('Connecting MySQL!!');
      });
    }
  }
};