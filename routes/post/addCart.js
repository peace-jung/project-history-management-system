const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let project_number = req.body.project_number;
  let sql = `insert into cart (id, project_number)
            value (${user.id}, ${project_number})`;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('관심 목록에 이미 있음. 삭제함.');
      sql = `delete from cart
              where id like "${user.id}" and project_number = ${project_number}`
      connection.query(sql, function (err, result) {
        if (err) console.log(err);
        res.send({ result: 'F' });
      });
    } else {
      console.log('관심 목록에 추가함');
      res.send({ result: 'T' });
    }
  });
}