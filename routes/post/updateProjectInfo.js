const isLogin = require('../isLogin');

module.exports = (req, res) => {
  if (!isLogin(req)) {
    res.redirect(`/proj_info?num='${req.body.project_number}'`);
  }

  let data = req.body; // 넘어온 데이터
  console.log(data);
  let member = JSON.parse(req.body.member);
  let memberArray = [];
  let act = JSON.parse(req.body.act);
  let refProjectArray = [];
  let referURLArray = [];

  // 참고한 프로젝트 정보 {project_number, title, context}
  if (req.body.refProject != "null") {
    let refProject = JSON.parse(req.body.refProject);
    for (let i in refProject) {
      refProjectArray.push(JSON.parse(refProject[i]));
    }
  }
  // 참고한 URL {project_number, title, context}
  if (req.body.referURL != "null") {
    let referURL = JSON.parse(req.body.referURL);
    for (let i in referURL) {
      referURLArray.push(JSON.parse(referURL[i]));
    }
  }
  // 멤버 {id, name}
  for (let i in member) {
    memberArray.push(JSON.parse(member[i]));
  }

  // 프로젝트 업데이트
  let sql = `UPDATE Projects SET
            title = "${data.title}", description = "${data.context}", project_type = "${data.type}", 
            leader = "${memberArray[data.leader].id}", leader_name = "${memberArray[data.leader].name}", 
            leader_grade = ${data.leader_grade}, date = "${data.date}", 
            topic = "${data.topic}" `;
  if (data.imageURL != 'null')
    sql += `imageURL = "${req.files['imageURL'][0].filename}" `;
  if (data.resultURL != 'null')
    sql += `resultURL = "${req.files['resultURL'][0].filename}" `;
  sql += `WHERE project_number = ${req.body.project_number}`;

  connection.query(sql, function (err, result) {
    if (err) {
      console.log("프로젝트 업데이트 실패", err);
      res.render('/projects', { user: user });
    } else {
      // 참여자 삭제 후 삽입
      sql = `delete from teammembers where project_number = ${data.project_number}`;
      connection.query(sql, member, function (err, result) {
        if (err) console.log('멤버삽입 에러', err);
        else {
          for (let i in memberArray) {
            sql = 'INSERT INTO teamMembers (id, project_number, part) values (?, ?, ?)';
            let member = [memberArray[i].id, data.project_number, act[i]];
            //console.log(member);

            connection.query(sql, member, function (err, result) {
              if (err) console.log('멤버삽입 에러', err);
              else console.log('멤버삽입 성공', sql);
            });
          }
        }
      });


      // 관계도 DB 삽입
      sql = `delete from ReferenceRelation where referenced = ${data.project_number}`;
      connection.query(sql, function (err, result) {
        if (err) console.log('멤버삽입 에러', err);
        else console.log('멤버삽입 성공', sql);
      });

      if (refProjectArray.length == 0) {
        sql1 = 'INSERT INTO ReferenceRelation (reference, referenced, refer_context, project_title) values (?, ?, ?, ?)';
        let refer = [data.project_number, data.project_number, "최초 개발", data.title];

        connection.query(sql1, refer, function (err, result) {
          if (err) console.log('관계도 삽입 에러', err);
          else console.log('관계도 삽입 성공', sql);
        });
      } else {
        for (let i in refProjectArray) {
          sql1 = 'INSERT INTO ReferenceRelation (reference, referenced, refer_context, project_title) values (?, ?, ?, ?)';
          let refer = [refProjectArray[i].project_number, data.project_number, refProjectArray[i].context, data.title];

          connection.query(sql1, refer, function (err, result) {
            if (err) console.log('관계도 삽입 에러', err);
            else console.log('관계도 삽입 성공', sql1);
          });

          sql2 = 'UPDATE Projects SET newest=false WHERE project_number LIKE (?)';
          connection.query(sql2, [refProjectArray[i].project_number], function (err, result) {
            if (err) console.log('최신여부 수정 에러', err);
            else console.log('최신여부 수정 성공', sql2);
          });
        }
      }

      // 참고자료 URL 삭제 후 추가
      sql = `delete from ReferenceData where project_number = ${data.project_number}`;
      connection.query(sql, function (err, result) {
        if (err) console.log('멤버삽입 에러', err);
        else console.log('멤버삽입 성공', sql);
      });

      if (referURLArray.length > 0) {
        for (let i in referURLArray) {
          console.log(referURLArray[i]);
          sql = 'INSERT INTO ReferenceData (reference_number, project_number, refer_context, url, refer_book) values (?, ?, ?, ?, ?)';
          let refer = [, data.project_number, referURLArray[i].referContext, referURLArray[i].referURL, referURLArray[i].referBook];

          connection.query(sql, refer, function (err, result) {
            if (err) console.log('참고자료 삽입 에러', err);
            else console.log('참고자료 삽입 성공', sql);
          });
        }
      }

      res.send({ result: true, id: data.project_number });
    }
  });
}