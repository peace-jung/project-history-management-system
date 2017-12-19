module.exports = (req, res) => {
  let project_number = req.body.project_number;
  console.log(project_number);
  sql = `delete from projects where project_number = ${project_number}`;
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    else
      res.send('good');
  });
}