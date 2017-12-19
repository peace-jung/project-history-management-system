const isLogin = require('../isLogin');

// Login Page
module.exports = (req, res) => {
  if (isLogin(req))
    res.redirect('/');
  else
    res.render('login');
};