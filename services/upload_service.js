require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const wasabiEndpoint = new AWS.Endpoint('https://s3.ap-southeast-1.wasabisys.com');



const s3Config = new AWS.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: process.env.AWS_IAM_USER_KEY,
  secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  Bucket: process.env.AWS_BUCKET_NAME
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

// this is just to test locally if multer is working fine.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req)
    cb(null, 'images');
  },
  filename: (req, file, cb) => {

    console.log(file)
    cb(null, `image-${Date.now()}` + path.extname(file.originalname))
    //path.extname get the uploaded file extension
  }
})

const multerS3Config = multerS3({
  s3: s3Config,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    console.log(file)
    cb(null, `image-${Date.now()}` + path.extname(file.originalname))
  }
});



const upload_service = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
  }
})


exports.uploadSingleImage = async (req, res) => {
  console.log(req.file);
  console.log('uploading');
  res.status(200).json({
    'statusCode': 200, 'status': true, message: 'Image added', 'data':
    req.file,

  });
};
exports.uploadMultipleImage = async (req, res) => {
  res.status(200).json({
    'statusCode': 200, 'status': true,
    message: 'All Image added', 'data': req.files,
  });
};


exports.profileImage = upload_service;
