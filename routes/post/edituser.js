const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let vip = req.body.vip == "TRUE" ? true : false;
  let info = [req.body.name, req.body.password, req.body.major, req.body.grade, req.body.address, req.body.enrollment, vip, req.body.id];
  console.log(info);
  sql = 'UPDATE users SET name=(?), password=(?), major=(?), grade=(?), address=(?), enrollment=(?), vip=(?) WHERE id like (?)';
  connection.query(sql, info, function (err, result) {
    if (err) console.log(err);
    res.redirect('/edituser?id=' + req.body.id);
  });
};