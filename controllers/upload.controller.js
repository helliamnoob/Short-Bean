// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = require('../config/s3Config'); // 위에서 생성한 S3 객체

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'your_bucket_name', // S3 버킷 이름
//     key: function (req, file, cb) {
//       cb(null, 'uploads/' + Date.now() + '-' + file.originalname); // 저장 경로 및 파일명 설정
//     },
//   }),
// });

// module.exports = {
//   upload: upload.single('file'),
// };
