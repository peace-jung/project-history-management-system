const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let data = req.body;
  let sql = 'insert into paper (paper_number, paper_type, summary, academy, submission) values (?, ?, ?, ?, ?)';
  let author = JSON.parse(data.author);
  console.log(author);
  let values = [null, data.paper_type, data.summary, data.academy, data.submission];

  // Insert to Paper
  connection.query(sql, values, function (err, result) {
    if (err) console.log(err);

    if (result) {
      // Insert to Author
      for (let i = 0; i < author.length; i++) {
        sql = 'insert into author (author_num, paper_number, author_name, author_ID) values (?,?,?,?)';
        let name = JSON.parse(author[i]).name;
        let id = JSON.parse(author[i]).id;
        values = [i + 1, result.insertId, name, id];
        connection.query(sql, values, function (err, result) {
          if (err) console.log(err);
        });
      }
      sql = 'insert into wins (wins_number, patent_number, contest_number, paper_number, wins_type, title, date) values (?, ?, ?, ?, ?, ?, ?)';
      values = [null, null, null, result.insertId, 'T02', data.paper_title, data.date];

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