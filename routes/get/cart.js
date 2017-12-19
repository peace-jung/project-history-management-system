const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (!isLogin(req))
    res.redirect('/');
  else {
    console.log(222);
    sql = `SELECT DISTINCT proj_info.project_number, proj_info.title, proj_info.project_type, proj_info.leader_name, 
          proj_info.date, proj_info.leader_grade, proj_info.avg_point 
          FROM cart, proj_info
          WHERE cart.project_number = proj_info.project_number
          AND cart.id = ${user.id}`;
    connection.query(sql, function (err, result) {
      if (err) console.log('관심 목록 조회 실패', err);
      console.log('관심 목록 조회 성공');
      res.render('cart', { user: user, list: result });
    });
  }
}