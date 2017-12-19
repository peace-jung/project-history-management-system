module.exports = (req, res) => {
  if (user.user_type != 'A') {
    console.log('권한없음');
    res.redirect('/');
  } else {
    let sql = 'SELECT * FROM users order by id';
    connection.query(sql, function (err, result) {
      if (err) {
        console.log("userlist 실패", err);
      } else {
        res.render('userlist', { user: user, userlist: result });
      }
    });
  }
};