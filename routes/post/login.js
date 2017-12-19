// Try Login
module.exports = (req, res) => {
  let id = req.body.id; // req로 부터 id 받아옴
  let pw = req.body.password; // pw 받아옴

  let loginuser = [id, pw];

  let sql = 'SELECT * FROM users WHERE id LIKE ? AND password LIKE ?';
  connection.query(sql, loginuser, function (err, result) {
    if (err) {
      console.log("login ", err);
      res.redirect('/');
    } else {
      if (result.length == 0) {
        console.log("회원 정보가 없음");
        res.redirect('/');
      }
      else {
        sess = req.session;
        sess.userId = result[0].id;
        sess.major = result[0].major;
        sess.name = result[0].name;
        sess.user_type = result[0].user_type;

        user = {
          id: req.session.userId ? req.session.userId : "undefined",
          name: req.session.name ? req.session.name : "undefined",
          major: req.session.major ? req.session.major : "undefined",
          user_type: req.session.user_type ? req.session.user_type : "undefined"
        };

        console.log('/login : ' + sess.userId + req.connection.remoteAddress);
        res.redirect('/');
      }
    }
  });
};