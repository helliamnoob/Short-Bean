const multer = require('multer');
const multer_s3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

let upload; // 업로드 미들웨어 변수 정의

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
console.log(upload);
module.exports = upload;
