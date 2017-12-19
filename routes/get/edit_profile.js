module.exports = (req, res) => {
  if (req.query.id != user.id) {
    console.log('권한없음');
    res.redirect('/');
  } else {
    console.log('맞음');
    sql = 'select id, name, password from users where id like (?)';
    connection.query(sql, user.id, function (err, result) {
      if (err) console.log(err);
      res.render('edit_profile', { user: user, info: result[0] });
    });
  }
};