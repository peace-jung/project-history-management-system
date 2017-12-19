module.exports = (req, res) => {
  let id = req.query.id;
  console.log(id);
  if (id) {
    /* 프로젝트 조회 */
    sql = 'SELECT * FROM proj_info WHERE id LIKE (?) ORDER BY date';
    connection.query(sql, [id], function (err, result) {
      if (err) res.redirect('/vips');

      let project = result;
      /* 성과 조회 */
      sql = 'SELECT * FROM std_proj_wins WHERE id LIKE (?) ORDER BY date';
      //connection.query(sql, [id], function (err, result) {
      //if (err) res.redirect('/vips');
      //let wins = result;
      let wins = [];

      res.render('profile', { user: user, project: project, wins: wins });
      //});
    });
  } else
    res.redirect('/vips');
}