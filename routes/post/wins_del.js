module.exports = (req, res) => {
  let wins_number = req.body.wins_number;

  sql = `delete from wins where wins_number = ${wins_number}`;
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    else
      res.send('good');
  });
}