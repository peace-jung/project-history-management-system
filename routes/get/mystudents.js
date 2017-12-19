const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (!isLogin(req)) {
    res.render('login');
  }
  sql = `SELECT DISTINCT
        projects.project_number, projects.leader, projects.leader_grade, projects.title, projects.date, projects.project_type
        FROM teammembers
        INNER JOIN users ON users.id=teammembers.id
        INNER JOIN projects
        ON teammembers.project_number = projects.project_number
        WHERE users.professor LIKE (?)
        ORDER BY projects.date DESC`;
  connection.query(sql, [user.id], function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');
    let list = result;

    sql = "select * from stdview where professor LIKE (?) ORDER BY id"
    connection.query(sql, [user.id], function (err, result) {
      if (err) console.log('목록 조회 실패', err);
      console.log('목록 조회 성공');

      res.render('mystudents', { user: user, list: list, std: result });
    });
  });
}