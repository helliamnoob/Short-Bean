// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// require('dotenv').config();
// const path = require('path');

const { error } = require('console');

// const s3 = new AWS.S3({
//   region: process.env.REGION,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.BUCKET_NAME,
//     acl: 'public-read-write',
//     key: (req, file, cb) => {
//       file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
//       const extension = path.extname(file.originalname);
//       if (!allowedExtensions.includes(extension)) {
//         return cb(new Error('wrong extension'));
//       }
//       cb(null, `menuimage/${Date.now()}_${file.originalname}`);
//     },
//   }),
// });
const sharp = require('sharp');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const env = process.env;
    const multer = require('multer');
    const multerS3 = require('multer-s3');
    const AWS = require('aws-sdk');
    const path = require('path');
    const uuid4 = require('uuid4');
    const s3 = new AWS.S3({
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_ACCESS_KEY_SECRET,
      region: env.AWS_REGION,
    });

    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp'];
    const upload = multer({
      storage: multerS3({
        s3,
        bucket: env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        key: function (req, file, callback) {
          const fileId = uuid4();
          const type = file.mimetype.split('/')[1];

          // 파일 확장자와 MIME 타입 검사
          if (
            !allowedExtensions.includes(path.extname(file.originalname.toLowerCase())) ||
            !file.mimetype.startsWith('image/')
          ) {
            const errorMessage = '이미지 파일만 업로드 할 수 있습니다.';
            const errorResponse = { errorMessage };
            return res.status(400).json(errorResponse);
          }

          const fileName = `${fileId}.${type}`;
          callback(null, fileName);
        },
        acl: 'public-read-write',
        limit: { fileSize: 50 * 1024 * 1024 },
      }),
    });

    // 여러 이미지 업로드 처리
    upload.array('photos', 10)(req, res, async (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: '파일 업로드 에러' });
      } else {
        const uploadedPhotos = req.files; // 업로드 된 사진들의 정보
        for (const photo of uploadedPhotos) {
          // 각 사진에 대한 처리 로직 구현
          console.log('uploaded photo:', photo.originalname);

          // 이미지 리사이징 함수 정의
          async function resizeImage(imageBuffer, width, height) {
            const resizedImageBuffer = await sharp(imageBuffer)
              .resize({ width, height })
              .toBuffer();
            return resizedImageBuffer;
          }

          // 이미지 리사이징 후 S3 업로드
          const resizedImageBuffer = await resizeImage(photo.buffer, 800, 600);
          const result = await s3
            .upload({
              Bucket: env.BUCKET_NAME,
              Key: 'resized-' + photo.originalname,
              Body: resizedImageBuffer,
            })
            .promise();

          console.log('Resized image uploaded:', result.Location);
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: '파일 업로드 에러' });
  }
};
