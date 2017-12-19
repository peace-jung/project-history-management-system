const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let data = req.body;
  let sql = 'insert into contest (contest_number, contest_context, host, award) values (?, ?, ?, ?)';
  let values = [null, data.context, data.host, data.award];

  // Insert to Contest
  connection.query(sql, values, function (err, result) {
    if (err) console.log(err);
    if (result) {
      sql = 'insert into wins (wins_number, patent_number, contest_number, paper_number, wins_type, title, date) values (?, ?, ?, ?, ?, ?, ?)';
      values = [null, null, result.insertId, null, 'T01', data.contest_title, data.date];

      // Insert to Wins
      connection.query(sql, values, function (err, result) {
        if (err) console.log(err);
        if (result) {
          sql = 'insert into projectWins (project_number, wins_number) values (?, ?)';
          values = [data.project_number, result.insertId];

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