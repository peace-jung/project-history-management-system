module.exports = (req, res) => {
  let project_number = req.query.num;
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
        sql = 'SELECT * FROM referenceRelation WHERE reference LIKE (?) OR referenced LIKE (?)'
        connection.query(sql, [project_number, project_number], function (err, refer) {
          if (err) console.log('연계 목록 조회 실패');
          //console.log('연계 목록 조회 성공: ');

          // 참고자료 select
          sql = 'SELECT * FROM referenceData WHERE project_number = (?)';
          connection.query(sql, [project_number], function (err, referData) {
            if (err) console.log('참고 자료 조회 실패');

            sql = `SELECT users.name, assessment.id, assessment.point, assessment.context
                  FROM users, 
                  (
                  SELECT assessment.id, assessment.point, assessment.context
                  FROM projects, assessment
                  WHERE projects.project_number = assessment.project_number AND projects.project_number = ${project_number}
                  ) AS assessment
                  WHERE users.id = assessment.id`;

            connection.query(sql, function (err, comment) {
              if (err) console.log('참고 자료 조회 실패');
              sql = `select * from cart where id like "${user.id}"`;
              connection.query(sql, function (err, cart) {
                if (err) console.log('관심 목록 조회 실패');
                res.render('proj_info', {
                  user: user, proj_info: result, wins: wins, refer: refer,
                  referData: referData, comment: comment, cart: cart
                });
              });
            });
          });
        });
      });
    } else {
      res.redirect('/projects');
    }
  });
}