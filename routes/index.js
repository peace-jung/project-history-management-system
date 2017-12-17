
const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const multer = require('multer');

const app = express();

const login = require('./login');

router.get('/login', login);

// 파일 업로드 시 저장공간 설정
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images') // 파일 저장 위치
  },
  filename: function (req, file, cb) {
    // 저장될 파일 이름 + 확장자
    cb(null, Date.now() + '-' + file.originalname)
  }
})
// multer 설정
const upload = multer({ storage: storage });

// DB Connection 세팅
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'history2',
  multipleStatements: true
});
//connection
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('Connecting MySQL!!');
});

function isLogin(req) { // 세션으로 로그인 유무 확인
  return req.session.userId ? true : false;
}

// 비로그인 상태
let user = {
  id: "undefined",
  name: "undefined",
  major: "undefined",
  user_type: "undefined"
};
// 로그인 유무 확인
function setUser(req) {
  return user = {
    id: req.session.userId ? req.session.userId : "undefined",
    name: req.session.name ? req.session.name : "undefined",
    major: req.session.major ? req.session.major : "undefined",
    user_type: req.session.user_type ? req.session.user_type : "undefined"
  }
}

function getMainData(res) {
  let data = {};
  let sql1 = 'select count(*) as std from stdview';
  let sql2 = 'select count(*) as projects from projects';

  connection.query(sql1, function (err, result) {
    if (err) throw err;
    console.log(result[0]);
    data.projects = result[0];

    //res.render('main', { user: user, data: result[0] });
  }, function () {
    connection.query(sql2, function (err, result) {
      if (err) throw err;
      console.log(result[0]);
      data.std = result[0];

      res.render('main', { user: user, data: data });
    });
  });
}

// 메인 페이지
router.get('/', (req, res) => {
  let user = setUser(req);
  //getMainData(res);
  res.redirect('/projects');
});
// 로그인 화면
router.get('/login', (req, res) => {
  console.log('object');
  if (isLogin(req))
    res.redirect('/');
  else
    res.render('login');
});
// 로그인 시도
router.post('/login', (req, res) => {
  let id = req.body.id; // req로 부터 id 받아옴
  let pw = req.body.password; // pw 받아옴

  let user = [id, pw];

  let sql = 'SELECT * FROM users WHERE id LIKE ? AND password LIKE ?';
  connection.query(sql, user, function (err, result) {
    if (err) {
      console.log("login ", err);
      res.redirect('/');
    } else {
      if (result.length == 0) {
        console.log("회원 정보가 없음");
        res.redirect('/');
      }
      else {
        sess = req.session;
        sess.userId = result[0].id;
        sess.major = result[0].major;
        sess.name = result[0].name;
        sess.user_type = result[0].user_type;
        console.log(sess.user_type);
        console.log('/login : ' + sess.userId + req.connection.remoteAddress);
        res.redirect('/');
      }
    }
  });
});

// 로그아웃 시도
router.get('/logout', function (req, res) {
  if (isLogin(req)) {
    console.log('logout : ' + sess.userId);
    req.session.destroy();
  }
  res.redirect('/');
});

// 비밀번호수정 화면
router.get('/edit_profile', function (req, res) {
  if (req.query.id != user.id) {
    console.log('권한없음');
    res.redirect('/');
  } else {
    console.log('맞음');
    sql = 'select id, name, password from users where id like (?)';
    connection.query(sql, user.id, function (err, result) {
      if (err) console.log(err);
      res.render('edit_profile', { user: user, info: result[0] });
    });
  }
});

// 비밀번호수정
router.post('/edit_profile', function (req, res) {
  let info = [req.body.name, req.body.password, user.id];
  sql = 'UPDATE users SET name = (?), password = (?) WHERE id like (?)';
  connection.query(sql, info, function (err, result) {
    if (err) console.log(err);
    req.session.name = req.body.name;
    user.name = req.body.name;
    res.render('edit_profile', { user: user, info: user });
  });
});

// 사용자 리스트: 관리자용
router.get('/userlist', function (req, res) {
  if (user.user_type != 'A') {
    console.log('권한없음');
    res.redirect('/');
  } else {
    let sql = 'SELECT * FROM users order by id';
    connection.query(sql, function (err, result) {
      if (err) {
        console.log("userlist 실패", err);
      } else {
        res.render('userlist', { user: user, userlist: result });
      }
    });
  }
});

// 회원정보수정 화면
router.get('/edituser', function (req, res) {
  if (user.user_type != 'A') {
    console.log('권한없음');
    res.redirect('/');
  } else {
    console.log('맞음');
    sql = 'select * from users where id like (?)';
    connection.query(sql, req.query.id, function (err, result) {
      if (err) console.log(err);
      res.render('edituser', { user: user, info: result[0] });
    });
  }
});

// 회원정보수정
router.post('/edituser', function (req, res) {
  let vip = req.body.vip == "TRUE" ? true : false;
  let info = [req.body.name, req.body.password, req.body.major, req.body.grade, req.body.address, req.body.enrollment, vip, req.body.id];
  console.log(info);
  sql = 'UPDATE users SET name=(?), password=(?), major=(?), grade=(?), address=(?), enrollment=(?), vip=(?) WHERE id like (?)';
  connection.query(sql, info, function (err, result) {
    if (err) console.log(err);
    res.redirect('/edituser?id=' + req.body.id);
  });
});

// 사용자 등록 : 관리자용
router.post('/adduser', function (req, res) {
  let user = [req.body.id, req.body.name, req.body.password, req.body.major,
  req.body.grade, req.body.address, req.body.encrollment, false,
    0, req.body.user_type, req.body.professor];

  let sql = 'INSERT INTO users (id, name, password, major, grade, address, encrollment, vip, caution, user_type, professor) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
  connection.query(sql, user, function (err, result) {
    if (err) {
      console.log("사용자 추가 실패", err);
      res.send({ result: false });
    } else {
      console.log('사용자 추가 성공');
      res.send({ result: true });
    }
  });
});

router.get('/activity', function (req, res) {
  console.log('activity');
  if (!isLogin(req)) {
    res.redirect('/projects');
  } else if (user.user_type == 'A') {
    res.render('adduser', { user: user });
  } else if (user.user_type == 'P') {
    res.redirect('/mystudents');
  } else res.redirect('/myprojects');
});

// 전체 프로젝트 목록
router.get('/projects', function (req, res) {
  let query = req.query.id;
  let select = req.query.selectid;
  let search_word = req.query.search_word;
  if (query == undefined) query = "undefind";
  res.render('projects', { user: user, query: query, select: select, search_word: search_word });
});

// 데이터테이블
router.get('/dataTable', function (req, res) {
  let sql = '';
  let query = req.query.query;
  if (query != "undefind") {
    sql = `SELECT * FROM proj_info where id like ${query}`;
  } else {
    sql = 'SELECT * FROM Projects';
  }
  console.log(sql);
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공1');

    let list = new Array();
    let type = '';
    let date = '';
    for (let i in result) {
      if (result[i].project_type == 'P01')
        type = '아이디어 도출'
      else type = '개발 완료'
      date = result[i].date.getFullYear() + ' /' + (result[i].date.getMonth() + 1) + ' /' + result[i].date.getDate();
      list.push([result[i].project_number, result[i].title, type, result[i].leader, date, result[i].leader_grade, result[i].avg_point, '']);
    }
    res.send({ data: list });
  });
})

// 프로젝트 검색
router.get('/search_list', function (req, res) {
  let id = req.query.query;
  console.log(id);
  let select = req.query.select;
  let search_word = req.query.search_word;
  if (id == "undefind") id = "";
  else id = `where id LIKE ${id}`;
  //console.log("search_list: ", id, select, search_word);

  if (select != undefined && search_word != undefined) {
    switch (select) {
      case '1': // 통합검색
        sql = `SELECT DISTINCT *
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE topic LIKE "%${search_word}%" 
                      OR description LIKE "%${search_word}%" 
                      OR name LIKE "%${search_word}%" 
                      OR id LIKE "%${search_word}%" 
                      OR title LIKE "%${search_word}%") a
              , (SELECT DISTINCT project_number FROM proj_info 
                      ${id}) b
              WHERE a.project_number = b.project_number`;
        console.log(sql);
        break;
      case '2': // 제목+내용
        sql = `SELECT DISTINCT *
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE description LIKE "%${search_word}%" 
                      OR title LIKE "%${search_word}%") a
              , (SELECT DISTINCT project_number FROM proj_info 
                      ${id}) b
              WHERE a.project_number = b.project_number`;
        console.log(sql);
        break;
      case '3': // 주제어+내용
        sql = `SELECT DISTINCT *
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE topic LIKE "%${search_word}%" 
                      OR description LIKE "%${search_word}%") a
              , (SELECT DISTINCT project_number FROM proj_info 
                      ${id}) b
              WHERE a.project_number = b.project_number`;
        console.log(sql);
        break;
      case '4': // 참여자
        sql = `SELECT DISTINCT *
              FROM
              (SELECT DISTINCT * FROM proj_info 
                      WHERE id LIKE "%${search_word}%"
                      OR name LIKE "%${search_word}%") a
              , (SELECT DISTINCT project_number FROM proj_info 
                      ${id}) b
              WHERE a.project_number = b.project_number`;
        console.log(sql);
        break;
    }

    connection.query(sql, function (err, result) {
      if (err) console.log('목록 조회 실패', err);
      console.log('검색 성공');
      let list = new Array();
      let type = '';
      let date = '';
      for (let i in result) {
        if (result[i].project_type == 'P01')
          type = '아이디어 도출'
        else type = '개발 완료'
        date = result[i].date.getFullYear() + ' /' + (result[i].date.getMonth() + 1) + ' /' + result[i].date.getDate();
        list.push([result[i].project_number, result[i].title, type, result[i].leader, date, result[i].leader_grade, result[i].avg_point, '']);
      }
      res.send({ data: list });
    });

  }
});

// 내 프로젝트 목록 : 학생용
router.get('/myprojects', function (req, res) {
  if (!isLogin(req)) {
    res.render('login');
  }
  res.redirect(`/projects?id=${user.id}`);
});

// 내 지도 학생 : 교수용
router.get('/mystudents', function (req, res) {
  if (!isLogin(req)) {
    res.render('login');
  }
  sql = `SELECT DISTINCT
        projects.project_number, projects.leader, projects.leader_grade, projects.title, projects.date, projects.project_type
        FROM teammembers
        INNER JOIN users ON users.id=teammembers.id
        INNER JOIN projects
        ON teammembers.project_number = projects.project_number
        WHERE users.professor LIKE (?)
        ORDER BY projects.date DESC`;
  connection.query(sql, [user.id], function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');
    let list = result;

    sql = "select * from stdview where professor LIKE (?) ORDER BY id"
    connection.query(sql, [user.id], function (err, result) {
      if (err) console.log('목록 조회 실패', err);
      console.log('목록 조회 성공');

      res.render('mystudents', { user: user, list: list, std: result });
    });
  });
});

// 프로젝트 등록 페이지로
router.get('/addLinks', function (req, res) {
  if (!isLogin(req)) {
    res.render('login');
  }
  let project_number = req.query.num;
  if (!project_number) {
    project_number = "null";
  }
  res.render('addLinks', { user: user, project_number: project_number });
});

// 프로젝트 등록, 업로드될 파일 속성/ html에서 input name
router.post('/addLinks', upload.fields([{ name: 'imageURL' }, { name: 'resultURL' }]), function (req, res) {
  let data = req.body; // 넘어온 데이터
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
  console.log(referURLArray);

  let project = [, data.title, data.context
    , data.type, memberArray[data.leader].id, memberArray[data.leader].name, data.leader_grade
    , req.files['imageURL'][0].filename, req.files['resultURL'][0].filename
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
          else console.log('멤버삽입 성공', sql);
        });
      }

      // 관계도 DB 삽입
      if (refProjectArray.length == 0) {
        sql1 = 'INSERT INTO ReferenceRelation (reference, referenced, refer_context, project_title) values (?, ?, ?, ?)';
        let refer = [result.insertId, result.insertId, "최초 개발", data.title];

        connection.query(sql1, refer, function (err, result) {
          if (err) console.log('관계도 삽입 에러', err);
          else console.log('관계도 삽입 성공', sql);
        });
      } else {
        for (let i in refProjectArray) {
          sql1 = 'INSERT INTO ReferenceRelation (reference, referenced, refer_context, project_title) values (?, ?, ?, ?)';
          let refer = [refProjectArray[i].project_number, result.insertId, refProjectArray[i].context, data.title];

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

      console.log(referURLArray.length);
      if (referURLArray.length > 0) {
        for (let i in referURLArray) {
          console.log(referURLArray[i]);
          sql = 'INSERT INTO ReferenceData (reference_number, project_number, refer_context, url, refer_book) values (?, ?, ?, ?, ?)';
          let refer = [, result.insertId, referURLArray[i].referContext, referURLArray[i].referURL, referURLArray[i].referBook];

          connection.query(sql, refer, function (err, result) {
            if (err) console.log('참고자료 삽입 에러', err);
            else console.log('참고자료 삽입 성공', sql);
          });
        }
      }

      if(req.body.delCart == 'true') {
        sql = '';
        for (let i in refProjectArray) {
          sql += `delete from cart 
                  where id like ${user.id} 
                  and project_number = ${refProjectArray[i].project_number};`
        }
        connection.query(sql, function (err, result) {
          if(err) console.log(err);
          else console.log('카트 삭제 완료');
        });
      }

      res.send({ result: true, id: result.insertId });
    }
  });
});

// 프로젝트 상세
router.get('/proj_info', function (req, res) {
  let project_number = req.query.num;
  let wins = [];
  let refer = [];

  let sql = `SELECT distinct
  title, wins_number, wins_type, date
  FROM wins_view
  WHERE project_number LIKE "${project_number}"`;
  connection.query(sql, function (err, wins) {
    if (err) console.log('성과 목록 조회 실패', err);
    //console.log('성과 목록 조회 성공');

    if (project_number) {
      // ㅇㅇ select
      sql = 'SELECT * FROM proj_info WHERE project_number = (?)';
      connection.query(sql, [project_number], function (err, result) {
        if (err) console.log('목록 조회 실패');
        if (result.length == 0) {
          res.redirect('/projects');
        }
        // 관계도 select
        sql = 'SELECT * FROM referenceRelation WHERE reference LIKE (?) OR referenced LIKE (?)'
        connection.query(sql, [project_number, project_number], function (err, refer) {
          if (err) console.log('연계 목록 조회 실패');
          //console.log('연계 목록 조회 성공: ');

          // 참고자료 select
          sql = 'SELECT * FROM referenceData WHERE project_number = (?)';
          connection.query(sql, [project_number], function (err, referData) {
            if (err) console.log('참고 자료 조회 실패');

            sql = `SELECT users.name, assessment.id, assessment.point, assessment.context
                  FROM users, 
                  (
                  SELECT assessment.id, assessment.point, assessment.context
                  FROM projects, assessment
                  WHERE projects.project_number = assessment.project_number AND projects.project_number = ${project_number}
                  ) AS assessment
                  WHERE users.id = assessment.id`;

            connection.query(sql, function (err, comment) {
              if (err) console.log('참고 자료 조회 실패');
              sql = `select * from cart where id like "${user.id}"`;
              connection.query(sql, function (err, cart) {
                if (err) console.log('관심 목록 조회 실패');
                res.render('proj_info', {
                  user: user, proj_info: result, wins: wins, refer: refer,
                  referData: referData, comment: comment, cart: cart
                });
              });
            });
          });
        });
      });
    } else {
      res.redirect('/projects');
    }
  });
});

// 성과 상세
router.get('/wins_info/:wins_number', function (req, res) {
  let wins_number = req.params.wins_number;
  let sql = `SELECT *
        FROM wins_view 
        WHERE wins_number LIKE "${wins_number}"`;
  connection.query(sql, function (err, result) {
    if (err) console.log('성과 상세 조회 실패');
    res.send(result);
  });
});

// 첨부파일 다운로드 
router.get('/resultDownload/:name', function (req, res) {
  let path = req.params.name;
  res.download('./public/images/' + path, path);
});

// 평가 등록 { user_id: , point: , context: }
router.post('/addComment', function (req, res) {
  let project_number = req.body.project_number;
  let user_id = req.body.user_id;
  let point = req.body.point;
  let context = req.body.context;

  let data = [user_id, parseInt(project_number), parseInt(point), context];

  let sql = 'INSERT INTO Assessment VALUES (?, ?, ?, ?)';
  connection.query(sql, data, function (err, result) {
    if (err) {
      if (err.code == 'ER_DUP_ENTRY') {
        console.log('평가 등록 실패: 이미 등록한 사용자');
        res.send({ result: false });
      } else
        console.log('심각한 문제 발생! : ', err);
    } else {
      console.log('평가 등록 성공');

      sql = `SELECT ROUND(AVG(point), 2) AS point
            FROM Assessment
            WHERE project_number = ${project_number}`;
      connection.query(sql, function (err, avg_point) {
        if (err) console.log(err);
        sql = `UPDATE Projects SET avg_point=${avg_point[0].point}
              WHERE project_number = ${project_number}`
        connection.query(sql, function (err, result) {
          if (err) console.log(err);
          res.send({ result: true });
        });
      });
    }
  });
});


// 성과 목록
router.get('/wins', function (req, res) {
  let myWins = [];
  let sql = '';

  if (user.user_type == "S") {
    sql = `SELECT DISTINCT wins_view.project_number, projects.title AS pt, wins_view.title AS wt, wins_view.wins_type, wins_view.date
        FROM wins_view, projects,
        (
          SELECT DISTINCT ProjectWins.project_number
            FROM ProjectWins
            JOIN TeamMembers ON ProjectWins.project_number = TeamMembers.project_number
            WHERE id LIKE '${user.id}'
        ) AS myproject
        WHERE wins_view.project_number =  projects.project_number
          AND myproject.project_number = wins_view.project_number
        ORDER BY wins_view.date`;
    connection.query(sql, function (err, result) {
      if (err) console.log('목록 조회 실패', err);
      console.log('목록 조회 성공');
      myWins = result;
    });
  }
  sql = `SELECT DISTINCT wins_view.project_number, projects.title AS pt, wins_view.title AS wt, wins_view.wins_type, wins_view.date
        FROM wins_view, projects
        WHERE wins_view.project_number =  projects.project_number
        ORDER BY wins_view.date`;
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');

    res.render('wins', { user: user, list: result, myWins: myWins });
  });
});

//공모전 등록
router.post('/addContest', function (req, res) {
  let data = req.body;
  let sql = 'insert into contest (contest_number, contest_context, host, award) values (?, ?, ?, ?)';
  let values = [null, data.context, data.host, data.award];

  // Insert to Contest
  connection.query(sql, values, function (err, result) {
    if (err) console.log(err);
    if (result) {
      sql = 'insert into wins (wins_number, patent_number, contest_number, paper_number, wins_type, title, date) values (?, ?, ?, ?, ?, ?, ?)';
      values = [null, null, result.insertId, null, 'T01', data.contest_title, data.date];

      // Insert to Wins
      connection.query(sql, values, function (err, result) {
        if (err) console.log(err);
        if (result) {
          sql = 'insert into projectWins (project_number, wins_number) values (?, ?)';
          values = [data.project_number, result.insertId];

          // Insert to ProjectWins
          connection.query(sql, values, function (err, result) {
            if (err) console.log(err);
            if (result) {
              res.send({ result: true });
            }
          });
        }
      });
    }
  });
});

//논문 등록
router.post('/addPaper', function (req, res) {
  let data = req.body;
  let sql = 'insert into paper (paper_number, paper_type, summary, academy, submission) values (?, ?, ?, ?, ?)';
  let author = JSON.parse(data.author);
  console.log(author);
  let values = [null, data.paper_type, data.summary, data.academy, data.submission];

  // Insert to Paper
  connection.query(sql, values, function (err, result) {
    if (err) console.log(err);

    if (result) {
      // Insert to Author
      for (let i = 0; i < author.length; i++) {
        sql = 'insert into author (author_num, paper_number, author_name, author_ID) values (?,?,?,?)';
        let name = JSON.parse(author[i]).name;
        let id = JSON.parse(author[i]).id;
        values = [i + 1, result.insertId, name, id];
        connection.query(sql, values, function (err, result) {
          if (err) console.log(err);
        });
      }
      sql = 'insert into wins (wins_number, patent_number, contest_number, paper_number, wins_type, title, date) values (?, ?, ?, ?, ?, ?, ?)';
      values = [null, null, null, result.insertId, 'T02', data.paper_title, data.date];

      // Insert to Wins
      connection.query(sql, values, function (err, result) {
        if (err) console.log(err);
        if (result) {
          sql = 'insert into projectWins (project_number, wins_number) values (?, ?)';
          values = [data.project_number, result.insertId];

          // Insert to ProjectWins
          connection.query(sql, values, function (err, result) {
            if (err) console.log(err);
            if (result) {
              res.send({ result: true });
            }
          });
        }
      });
    }
  });
});

//특허 등록
router.post('/addPatent', function (req, res) {
  let data = req.body;
  let sql = 'insert into patent (patent_number, patent_context, regist_number, regist_date) values (?, ?, ?, ?)';
  let inventor = JSON.parse(data.inventor);
  let regist_number = data.regist_number ? data.regist_number : null;
  let regist_date = data.regist_date ? data.regist_date : null;

  let values = [data.patent_number, data.patent_context, regist_number, regist_date];

  // Insert to Patent
  connection.query(sql, values, function (err, result) {
    if (err) console.log(err);

    if (result) {
      // Insert to Inventor
      for (let i = 0; i < inventor.length; i++) {
        console.log(JSON.parse(inventor[i]));
        sql = 'insert into inventor values (?,?,?,?)';
        let name = JSON.parse(inventor[i]).name;
        let id = JSON.parse(inventor[i]).id;
        values = [i + 1, data.patent_number, name, id];
        connection.query(sql, values, function (err, result) {
          if (err) console.log(err);
        });
      }
      sql = 'insert into wins (wins_number, patent_number, contest_number, paper_number, wins_type, title, date) values (?, ?, ?, ?, ?, ?, ?)';
      values = [null, data.patent_number, null, null, 'T03', data.patent_title, data.date];

      // Insert to Wins
      connection.query(sql, values, function (err, result) {
        if (err) console.log(err);
        if (result) {
          sql = 'insert into projectWins (project_number, wins_number) values (?, ?)';
          values = [parseInt(data.project_number), result.insertId];

          // Insert to ProjectWins
          connection.query(sql, values, function (err, result) {
            if (err) console.log(err);
            if (result) {
              res.send({ result: true });
            }
          });
        }
      });
    }
  });
});


// 우수 회원
router.get('/vips', function (req, res) {
  sql = 'SELECT * FROM users WHERE vip=true ORDER BY id';
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');

    res.render('vips', { user: user, list: result });
  });
});
// 학생 프로필
router.get('/profile', function (req, res) {
  let id = req.query.id;
  console.log(id);
  if (id) {
    /* 프로젝트 조회 */
    sql = 'SELECT * FROM proj_info WHERE id LIKE (?) ORDER BY date';
    connection.query(sql, [id], function (err, result) {
      if (err) res.redirect('/vips');

      let project = result;
      /* 성과 조회 */
      sql = 'SELECT * FROM std_proj_wins WHERE id LIKE (?) ORDER BY date';
      //connection.query(sql, [id], function (err, result) {
      //if (err) res.redirect('/vips');
      //let wins = result;
      let wins = [];

      res.render('profile', { user: user, project: project, wins: wins });
      //});
    });
  } else
    res.redirect('/vips');
});

// id로 검색
router.post('/searchId', function (req, res) {
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
});
// proj_id로 검색
router.post('/search_proj_id', function (req, res) {
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
});

// 프로젝트 제목으로 검색
router.get('/search_proj', function (req, res) {
  let title = req.query.title;
  console.log(title);
  sql = 'SELECT DISTINCT * FROM Projects WHERE title LIKE "%' + title + '%"';
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');
    res.render('projects', { user: user, list: result });
  });
});
// 학생 이름으로 검색
router.get('/search_std', function (req, res) {
  let name = req.query.name;
  console.log(name);
  sql = 'SELECT DISTINCT project_number, title FROM proj_info WHERE name LIKE "%' + name + '%"';
  connection.query(sql, function (err, result) {
    if (err) console.log('목록 조회 실패', err);
    console.log('목록 조회 성공');
    res.render('projects', { user: user, list: result });
  });
});

// 관심 프로젝트 목록
router.get('/cart', function (req, res) {
  if (!isLogin(req))
    res.redirect('/');
  else {
    sql = `SELECT DISTINCT proj_info.project_number, proj_info.title, proj_info.project_type, proj_info.leader_name, 
          proj_info.date, proj_info.leader_grade, proj_info.avg_point 
          FROM cart, proj_info
          WHERE cart.project_number = proj_info.project_number
          AND cart.id = ${user.id}`;
    connection.query(sql, function (err, result) {
      if (err) console.log('관심 목록 조회 실패', err);
      console.log('관심 목록 조회 성공');
      res.render('cart', { user: user, list: result });
    });
  }
});

// 연계 프로젝트 등록
router.get('/addReferList', function (req, res) {
  if (!isLogin(req))
    res.redirect('/');
  else {
    project_list = JSON.parse(req.query.pn);
    if (project_list.length > 0)
      res.render('addReferProject', { user: user, list: project_list });
    else res.redirect('/addLinks');
  }
});


// 카트에 추가 또는 삭제
router.post('/addCart', function (req, res) {
  let project_number = req.body.project_number;
  let sql = `insert into cart (id, project_number)
            value (${user.id}, ${project_number})`;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('관심 목록에 이미 있음. 삭제함.');
      sql = `delete from cart
              where id like "${user.id}" and project_number = ${project_number}`
      connection.query(sql, function (err, result) {
        if (err) console.log(err);
        res.send({ result: 'F' });
      });
    } else {
      console.log('관심 목록에 추가함');
      res.send({ result: 'T' });
    }
  });
});


module.exports = router;