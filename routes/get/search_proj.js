module.exports = (req, res) => {
  let title = req.query.title;
  console.log(title);
  sql = 'SELECT DISTINCT * FROM Projects WHERE title LIKE "%' + title + '%"';
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');
    res.render('projects', { user: user, list: result });
  });
}