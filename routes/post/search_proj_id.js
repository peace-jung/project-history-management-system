module.exports = (req, res) => {
  let id = req.body.proj_id; // pw 받아옴

  let sql = 'SELECT project_number, title FROM projects WHERE project_number LIKE ' + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("no data");
      res.send({ result: false });
    } else {
      if (result.length == 0) {
        console.log("프로젝트 정보가 없음");
        res.send({ result: false });
      }
      else {
        res.send({ project_number: result[0].project_number, title: result[0].title });
      }
    }
  });
}