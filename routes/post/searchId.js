module.exports = (req, res) => {
  let id = req.body.id; // pw 받아옴

  let sql = 'SELECT id, name, grade FROM stdview WHERE id LIKE ' + id;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("no data");
      res.send({ result: false });
    } else {
      if (result.length == 0) {
        console.log("회원 정보가 없음");
        res.send({ result: false });
      }
      else {
        res.send({ id: result[0].id, name: result[0].name, grade: result[0].grade });
      }
    }
  });
}