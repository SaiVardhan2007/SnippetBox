const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getSetupStatus } = require('../controllers/userController');
const validateToken = require('../middleware/validateToken_handler');

router.route('/register').post(registerUser); 
router.route('/login').post(loginUser);
router.route('/profile').get(validateToken, getUserProfile);
router.route('/setup-status').get(getSetupStatus);

module.exports = router;