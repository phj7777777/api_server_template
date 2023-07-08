const express = require('express');

const controller = require('../services/health_service');

const router = express.Router();

router.get('/', (req, res) => {
  controller.getStatus(res);
});

module.exports = router;
