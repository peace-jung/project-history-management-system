module.exports = (req, res) => {
  let sql = '';
  let query = req.query.query;
  if (query != "undefind") {
    sql = `SELECT * FROM proj_info where id like ${query}`;
  } else {
    sql = 'SELECT * FROM Projects';
  }
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공1');

    let list = new Array();
    let type = '';
    let date = '';
    for (let i in result) {
      if (result[i].project_type == 'P01')
        type = '아이디어 도출'
      else type = '개발 완료'
      date = result[i].date.getFullYear() + ' /' + (result[i].date.getMonth() + 1) + ' /' + result[i].date.getDate();
      list.push([result[i].project_number, result[i].title, type, result[i].leader_name, date, result[i].leader_grade, result[i].avg_point, '']);
    }
    res.send({ data: list });
  });
}