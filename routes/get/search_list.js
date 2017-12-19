module.exports = (req, res) => {
  let id = req.query.query;
  console.log(id);
  let select = req.query.select;
  let search_word = req.query.search_word;

  console.log("search_list: ", id, select, search_word);

  if (select != undefined && search_word != undefined) {
    switch (select) {
      case '1': // 통합검색
        sql = `SELECT DISTINCT a.project_number,
              a.title, a.project_type, a.leader_name,
              a.date, a.leader_grade, a.avg_point
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE topic LIKE "%${search_word}%"
                      OR description LIKE "%${search_word}%"
                      OR name LIKE "%${search_word}%"
                      OR id LIKE "%${search_word}%"
                      OR title LIKE "%${search_word}%") a`;
        if (id != "undefind")
          sql += `, (SELECT DISTINCT project_number FROM proj_info 
                      where id = ${id}) b
                      WHERE a.project_number = b.project_number`;
        //console.log(sql);
        break;
      case '2': // 제목+내용
        sql = `SELECT DISTINCT *
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE description LIKE "%${search_word}%" 
                      OR title LIKE "%${search_word}%") a`;
        if (id != "undefind")
          sql += `, (SELECT DISTINCT project_number FROM proj_info 
                      where id = ${id}) b
                      WHERE a.project_number = b.project_number`;
        //console.log(sql);
        break;
      case '3': // 주제어+내용
        sql = `SELECT DISTINCT *
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE topic LIKE "%${search_word}%" 
                      OR description LIKE "%${search_word}%") a`;
        if (id != "undefind")
          sql += `, (SELECT DISTINCT project_number FROM proj_info 
                      where id = ${id}) b
                      WHERE a.project_number = b.project_number`;
        //console.log(sql);
        break;
      case '4': // 참여자
        sql = `SELECT DISTINCT *
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE id LIKE "%${search_word}%"
                      OR name LIKE "%${search_word}%") a`;
        if (id != "undefind")
          sql += `, (SELECT DISTINCT project_number FROM proj_info 
                      where id = ${id}) b
                      WHERE a.project_number = b.project_number`;
        //console.log(sql);
        break;
    }

    connection.query(sql, function (err, result) {
      if (err) console.log('목록 조회 실패', err);
      console.log('검색 성공');
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
}