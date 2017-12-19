module.exports = (req, res) => {
  let query = req.query.id;
  let select = req.query.selectid;
  let search_word = req.query.search_word;
  if (query == undefined) query = "undefind";
  res.render('projects', { user: user, query: query, select: select, search_word: search_word });
}