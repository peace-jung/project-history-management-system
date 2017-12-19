const bodyParser = require('body-parser');

module.exports = (req, res) => {
  let data = req.body; // 넘어온 데이터
  let member = JSON.parse(req.body.member);
  let memberArray = [];
  let act = JSON.parse(req.body.act);
  let refProjectArray = [];
  let referURLArray = [];

  let imageURL, resultURL;

  if (req.body.imageURL != 'null') {
    imageURL = req.files['imageURL'][0].filename;
  } else {
    imageURL = 'null';
  }
  if (req.body.resultURL != 'null') {
    resultURL = req.files['resultURL'][0].filename;
  } else {
    resultURL = 'null';
  }
  
  // 참고한 프로젝트 정보 {project_number, title, context}
  if (req.body.refProject != "null") {
    let refProject = JSON.parse(req.body.refProject);
    for (let i in refProject) {
      refProjectArray.push(JSON.parse(refProject[i]));
    }
  } else {

  }
  console.log(refProjectArray);
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

  let project = [, data.title, data.context
    , data.type, memberArray[data.leader].id, memberArray[data.leader].name, data.leader_grade
    , imageURL, resultURL
    , data.date, true, data.topic, 0];

  let sql = 'INSERT INTO Projects (project_number, title, description, project_type, leader, leader_name, leader_grade, imageURL, resultURL, date, newest, topic, avg_point) values (?,?,?,?,?,?,?,?,?,?,?,?,?)';
  connection.query(sql, project, function (err, result) {
    if (err) {
      console.log("프로젝트 등록 실패", err);
      res.render('/projects', { user: user });
    } else {
      // 참여자 DB 삽입
      for (let i in memberArray) {
        sql = 'INSERT INTO teamMembers (id, project_number, part) values (?, ?, ?)';
        let member = [memberArray[i].id, result.insertId, act[i]];
        //console.log(member);

        connection.query(sql, member, function (err, result) {
          if (err) console.log('멤버삽입 에러', err);
          else console.log('멤버삽입 성공');
        });
      }

      // 관계도 DB 삽입
      if (refProjectArray.length == 0) {
        sql1 = 'INSERT INTO ReferenceRelation (reference, referenced, refer_context, project_title) values (?, ?, ?, ?)';
        let refer = [result.insertId, result.insertId, "최초 개발", data.title];

        connection.query(sql1, refer, function (err, result) {
          if (err) console.log('관계도 삽입 에러1', err);
          else console.log('관계도 삽입 성공');
          console.log('11111');
        });
      } else {
        for (let i in refProjectArray) {
          sql1 = 'INSERT INTO ReferenceRelation (reference, referenced, refer_context, project_title) values (?, ?, ?, ?)';
          let refer = [refProjectArray[i].project_number, result.insertId, refProjectArray[i].context, data.title];

          connection.query(sql1, refer, function (err, result) {
            if (err) console.log('관계도 삽입 에러2', err);
            else console.log('관계도 삽입 성공');
            console.log('2222');
          });

          sql2 = 'UPDATE Projects SET newest=false WHERE project_number LIKE (?)';
          connection.query(sql2, [refProjectArray[i].project_number], function (err, result) {
            if (err) console.log('최신여부 수정 에러', err);
            else console.log('최신여부 수정 성공');
            console.log('3333');
          });
        }
      }

      console.log(referURLArray.length);
      if (referURLArray.length > 0) {
        for (let i in referURLArray) {
          console.log(referURLArray[i]);
          sql = 'INSERT INTO ReferenceData (reference_number, project_number, refer_context, url, refer_book) values (?, ?, ?, ?, ?)';
          let refer = [, result.insertId, referURLArray[i].referContext, referURLArray[i].referURL, referURLArray[i].referBook];

          connection.query(sql, refer, function (err, result) {
            if (err) console.log('참고자료 삽입 에러', err);
            else console.log('참고자료 삽입 성공');
          });
        }
      }

      if (req.body.delCart == 'true') {
        sql = '';
        for (let i in refProjectArray) {
          sql += `delete from cart 
                  where id like ${user.id} 
                  and project_number = ${refProjectArray[i].project_number};`
        }
        connection.query(sql, function (err, result) {
          if (err) console.log(err);
          else console.log('카트 삭제 완료');
        });
      }

      res.send({ result: true, id: result.insertId });
    }
  });
}