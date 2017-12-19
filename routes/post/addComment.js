const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let project_number = req.body.project_number;
  let user_id = req.body.user_id;
  let point = req.body.point;
  let context = req.body.context;

  let data = [user_id, parseInt(project_number), parseInt(point), context];

  let sql = 'INSERT INTO Assessment VALUES (?, ?, ?, ?)';
  connection.query(sql, data, function (err, result) {
    if (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        console.log('평가 등록 실패: 이미 등록한 사용자');
        res.send({ result: false });
      } else
        console.log('심각한 문제 발생! : ', err);
    } else {
      console.log('평가 등록 성공');

      sql = `SELECT ROUND(AVG(point), 2) AS point
            FROM Assessment
            WHERE project_number = ${project_number}`;
      connection.query(sql, function (err, avg_point) {
        if (err) console.log(err);
        sql = `UPDATE Projects SET avg_point=${avg_point[0].point}
              WHERE project_number = ${project_number}`
        connection.query(sql, function (err, result) {
          if (err) console.log(err);
          res.send({ result: true });
        });
      });
    }
  });
}