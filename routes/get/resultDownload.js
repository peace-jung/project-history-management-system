module.exports = (req, res) => {
  let path = req.params.name;
  res.download('./public/images/' + path, path);
}