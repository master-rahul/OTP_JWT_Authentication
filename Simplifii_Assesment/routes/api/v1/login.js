const express = require("express");
const router = express.Router();
const loginController = require('../../../controller/v1/login');

router.post('/verify', loginController.verify);
router.post('/signIn', loginController.signIn);

module.exports = router;