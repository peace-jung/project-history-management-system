const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let user = [req.body.id, req.body.name, req.body.password, req.body.major,
  req.body.grade, req.body.address, req.body.enrollment, false,
    0, req.body.user_type, req.body.professor];

  let sql = 'INSERT INTO users (id, name, password, major, grade, address, enrollment, vip, caution, user_type, professor) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
  connection.query(sql, user, function (err, result) {
    if (err) {
      console.log("사용자 추가 실패", err);
      res.send({ result: false });
    } else {
      console.log('사용자 추가 성공');
      res.send({ result: true });
    }
  });
}