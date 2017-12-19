const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (!isLogin(req)) {
    res.redirect(`/proj_info?num='${req.body.project_number}'`);
  }
  let project_number = req.body.project_number;
  console.log(project_number);
  let wins = [];
  let refer = [];

  let sql = `SELECT distinct
  title, wins_number, wins_type, date
  FROM wins_view
  WHERE project_number LIKE "${project_number}"`;
  connection.query(sql, function (err, wins) {
    if (err) console.log('성과 목록 조회 실패', err);
    //console.log('성과 목록 조회 성공');

    if (project_number) {
      // ㅇㅇ select
      sql = 'SELECT * FROM proj_info WHERE project_number = (?)';
      connection.query(sql, [project_number], function (err, result) {
        if (err) console.log('목록 조회 실패');
        if (result.length == 0) {
          res.redirect('/projects');
        }
        // 관계도 select
        sql = `select DISTINCT referenced.reference, referenced.refer_context, referenceRelation.project_title 
              from referenceRelation,
              (select reference, refer_context from referenceRelation
              where referenced like ${project_number}) AS referenced
              where referenceRelation.referenced = referenced.reference`
        connection.query(sql, function (err, refer) {
          if (err) console.log('연계 목록 조회 실패');
          console.log('연계 목록 조회 성공: ');

          // 참고자료 select
          sql = 'SELECT * FROM referenceData WHERE project_number = (?)';
          connection.query(sql, [project_number], function (err, referData) {
            if (err) console.log('참고 자료 조회 실패');
            if (err) console.log('참고 자료 조회 실패');
            console.log('다조회 끝');
            res.render('updateProject', {
              user: user, proj_info: result,
              wins: wins, refer: refer,
              referData: referData
            });
          });
        });
      });
    } else {
      res.redirect('/projects');
    }
  });
}