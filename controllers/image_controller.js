const express = require('express');
const controller = require('../src/images/controller');
const { profileImage } = require('../services/upload_service');
const router = express.Router();

// Upload single image
router.post('/upload',
  profileImage.single('icon'), controller.uploadSingleImage);

// Upload multiple image
router.post('/upload/multi', profileImage.array('icon', 12), controller.uploadMultipleImage);


module.exports = router;