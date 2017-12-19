const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (isLogin(req)) {
    console.log('logout : ' + sess.userId);
    sess.destroy();
    user = {
      id: "undefined",
      name: "undefined",
      major: "undefined",
      user_type: "undefined"
    };
  }
  res.redirect('/projects');
};