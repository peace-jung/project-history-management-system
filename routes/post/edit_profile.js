const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let info = [req.body.name, req.body.password, user.id];
  sql = 'UPDATE users SET name = (?), password = (?) WHERE id like (?)';
  connection.query(sql, info, function (err, result) {
    if (err) console.log(err);
    req.session.name = req.body.name;
    user.name = req.body.name;
    res.render('edit_profile', { user: user, info: user });
  });
};