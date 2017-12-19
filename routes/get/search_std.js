module.exports = (req, res) => {
  let name = req.query.name;
  console.log(name);
  sql = 'SELECT DISTINCT project_number, title FROM proj_info WHERE name LIKE "%' + name + '%"';
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');
    res.render('projects', { user: user, list: result });
  });
}