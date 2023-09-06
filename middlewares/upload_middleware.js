const multer = require('multer');
const multer_s3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

let upload; // 업로드 미들웨어 변수 정의
let s3; // s3 객체 변수 정의

try {
  // AWS 설정
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  // Multer 및 Multer-S3 설정
  const storage = multer_s3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    contentType: multer_s3.AUTO_CONTENT_TYPE,
    acl: 'public-read-write',
    key: function (req, file, cb) {
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/bmp'].includes(file.mimetype)) {
        return cb(new Error('이미지 파일만 업로드 가능합니다.'));
      }

      if (file.size > 1024 * 1024) {
        return cb(new Error('이미지 크기는 최대 1MB 입니다.'));
      }
      cb(null, `image/post/${Date.now().toString()}-${file.originalname}`);
    },
  });

  upload = multer({
    storage: storage,
    limits: { files: 10 }, // 최대 10개의 파일을 업로드 가능하도록 설정
  });
} catch (error) {
  console.error(error);
}

module.exports = { upload };
