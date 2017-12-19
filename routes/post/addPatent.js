const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let data = req.body;
  let sql = 'insert into patent (patent_number, patent_context, regist_number, regist_date) values (?, ?, ?, ?)';
  let inventor = JSON.parse(data.inventor);
  let regist_number = data.regist_number ? data.regist_number : null;
  let regist_date = data.regist_date ? data.regist_date : null;

  let values = [data.patent_number, data.patent_context, regist_number, regist_date];

  // Insert to Patent
  connection.query(sql, values, function (err, result) {
    if (err) console.log(err);

    if (result) {
      // Insert to Inventor
      for (let i = 0; i < inventor.length; i++) {
        console.log(JSON.parse(inventor[i]));
        sql = 'insert into inventor values (?,?,?,?)';
        let name = JSON.parse(inventor[i]).name;
        let id = JSON.parse(inventor[i]).id;
        values = [i + 1, data.patent_number, name, id];
        connection.query(sql, values, function (err, result) {
          if (err) console.log(err);
        });
      }
      sql = 'insert into wins (wins_number, patent_number, contest_number, paper_number, wins_type, title, date) values (?, ?, ?, ?, ?, ?, ?)';
      values = [null, data.patent_number, null, null, 'T03', data.patent_title, data.date];

      // Insert to Wins
      connection.query(sql, values, function (err, result) {
        if (err) console.log(err);
        if (result) {
          sql = 'insert into projectWins (project_number, wins_number) values (?, ?)';
          values = [parseInt(data.project_number), result.insertId];

          // Insert to ProjectWins
          connection.query(sql, values, function (err, result) {
            if (err) console.log(err);
            if (result) {
              res.send({ result: true });
            }
          });
        }
      });
    }
  });
}