const express = require('express');
const router = express.Router();

const multer = require('./multer')();
const login = require('./post/login');
const edit_profile = require('./post/edit_profile');
const edituser = require('./post/edituser');
const adduser = require('./post/adduser');
const addLinks = require('./post/addLinks');
const updateProject = require('./post/updateProject');
const updateProjectInfo = require('./post/updateProjectInfo');
const project_del = require('./post/project_del');
const wins_del = require('./post/wins_del');
const addComment = require('./post/addComment');
const addContest = require('./post/addContest');
const addPaper = require('./post/addPaper');
const addPatent = require('./post/addPatent');
const searchId = require('./post/searchId');
const search_proj_id = require('./post/search_proj_id');
const addCart = require('./post/addCart');

const upload = multer.upload;
/* connection = mysqlConnection.init(); //전역객체 선언
mysqlConnection.open(); */

router.post('/login', login); // 로그인 시도
router.post('/edit_profile', edit_profile); // 비밀번호수정 반영
router.post('/edituser', edituser); // 회원정보수정 반영
router.post('/adduser', adduser); // 사용자 등록 : 관리자용
router.post('/addLinks', upload.fields([{ name: 'imageURL' }, { name: 'resultURL' }]), addLinks); // 프로젝트 등록, 업로드될 파일 속성/ html에서 input name = this name
router.post('/updateProject', updateProject); //프로젝트 수정 페이지로
router.post('/updateProjectInfo', upload.fields([{ name: 'imageURL' }, { name: 'resultURL' }]), updateProjectInfo); // 프로젝트 수정 정보 반영
router.post('/project_del', project_del); //프로젝트 삭제
router.post('/wins_del', wins_del); //성과 삭제
router.post('/addComment', addComment); // 평가 등록
router.post('/addContest', addContest); //공모전 등록
router.post('/addPaper', addPaper); //논문 등록
router.post('/addPatent', addPatent); //특허 등록
router.post('/searchId', searchId); // id로 검색
router.post('/search_proj_id', search_proj_id); // proj_id로 검색
router.post('/addCart', addCart); // 카트에 추가 또는 삭제

module.exports = router;