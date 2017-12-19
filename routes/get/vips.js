module.exports = (req, res) => {
  sql = 'SELECT * FROM users WHERE vip=true ORDER BY id';
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');

    res.render('vips', { user: user, list: result });
  });
}