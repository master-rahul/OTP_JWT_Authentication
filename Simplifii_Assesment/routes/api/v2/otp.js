const express = require("express");
const router = express.Router();
const otpController = require('../../../controller/v2/otp');

router.post('/generate', otpController.generate);

module.exports = router;