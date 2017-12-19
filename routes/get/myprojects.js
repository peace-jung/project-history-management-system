const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (!isLogin(req)) {
    res.render('login');
  }
  res.redirect(`/projects?id=${user.id}`);
}