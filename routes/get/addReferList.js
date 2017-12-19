const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (!isLogin(req))
    res.redirect('/');
  else {
    project_list = JSON.parse(req.query.pn);
    if (project_list.length > 0)
      res.render('addReferProject', { user: user, list: project_list });
    else res.redirect('/addLinks');
  }
}