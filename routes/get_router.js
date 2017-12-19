const express = require('express');
const router = express.Router();

const isLogin = require('./isLogin');
const login = require('./get/login');
const logout = require('./get/logout');
const edit_profile = require('./get/edit_profile');
const userlist = require('./get/userlist');
const edituser = require('./get/edituser');
const projects = require('./get/projects');
const dataTable = require('./get/dataTable');
const search_list = require('./get/search_list');
const myprojects = require('./get/myprojects');
const mystudents = require('./get/mystudents');
const addLinks = require('./get/addLinks');
const proj_info = require('./get/proj_info');
const wins_info = require('./get/wins_info');
const resultDownload = require('./get/resultDownload');
const wins = require('./get/wins');
const vips = require('./get/vips');
const profile = require('./get/profile');
const search_proj = require('./get/search_proj');
const search_std = require('./get/search_std');
const cart = require('./get/cart');
const addReferList = require('./get/addReferList');

// 메인 페이지
router.get('/', (req, res) => {
  res.redirect('/projects');
});
router.get('/login', login); // 로그인 화면
router.get('/logout', logout); // 로그아웃 시도
router.get('/edit_profile', edit_profile); // 비밀번호수정 페이지
router.get('/userlist', userlist); // 사용자 리스트: 관리자용
router.get('/edituser', edituser); // 회원정보수정 페이지
router.get('/activity', function (req, res) {
  if (!isLogin(req)) {
    res.redirect('/projects');
  } else if (user.user_type == 'A') {
    res.render('adduser', { user: user });
  } else if (user.user_type == 'P') {
    res.redirect('/mystudents');
  } else res.redirect('/myprojects');
});
router.get('/projects', projects); // 전체 프로젝트 목록
router.get('/dataTable', dataTable); // 데이터테이블
router.get('/search_list', search_list); // 프로젝트 검색
router.get('/myprojects', myprojects); // 내 프로젝트 목록 : 학생용
router.get('/mystudents', mystudents);// 내 지도 학생 : 교수용
router.get('/addLinks', addLinks); // 프로젝트 등록 페이지로
router.get('/proj_info', proj_info); // 프로젝트 상세
router.get('/wins_info/:wins_number', wins_info); // 성과 상세
router.get('/resultDownload/:name', resultDownload); // 첨부파일 다운로드
router.get('/wins', wins); // 성과 목록
router.get('/vips', vips); // 우수 회원
router.get('/profile', profile); // 학생 프로필
router.get('/search_proj', search_proj); // 프로젝트 제목으로 검색
router.get('/search_std', search_std); // 학생 이름으로 검색
router.get('/cart', cart); // 관심 프로젝트 목록
router.get('/addReferList', addReferList); // 연계 프로젝트 등록


module.exports = router;