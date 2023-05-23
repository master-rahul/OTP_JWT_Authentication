const express = require("express");
const router = express.Router();

router.use('/api/v1', require('./api/v1/index'));
router.use('/api/v2', require('./api/v2/index'));

module.exports = router;