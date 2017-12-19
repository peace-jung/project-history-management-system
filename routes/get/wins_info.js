module.exports = (req, res) => {
  let wins_number = req.params.wins_number;
  let sql = `SELECT *
        FROM wins_view 
        WHERE wins_number LIKE "${wins_number}"`;
  connection.query(sql, function (err, result) {
    if (err) console.log('성과 상세 조회 실패');
    res.send(result);
  });
}