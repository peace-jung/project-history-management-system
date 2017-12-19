const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (!isLogin(req)) {
    res.render('login');
  }
  let project_number = req.query.num;
  if (!project_number) {
    project_number = "null";
  }
  res.render('addLinks', { user: user, project_number: project_number });
}