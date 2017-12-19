const multer = require('multer');

// 파일 업로드 시 저장공간 설정
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files') // 파일 저장 위치
  },
  filename: function (req, file, cb) {
    // 저장될 파일 이름 + 확장자
    cb(null, Date.now() + '-' + file.originalname)
  }
})
// multer 설정
//const upload = multer({ storage: storage });

module.exports = () => {
  return {
    upload: multer({ storage: storage })
  }
};