module.exports = (req, res) => {
  if (user.user_type != 'A') {
    console.log('권한없음');
    res.redirect('/');
  } else {
    console.log('맞음');
    sql = 'select * from users where id like (?)';
    connection.query(sql, req.query.id, function (err, result) {
      if (err) console.log(err);
      res.render('edituser', { user: user, info: result[0] });
    });
  }
};