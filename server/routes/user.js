const express = require('express');

const UserController = require('../controllers/user');
const Userauthentication = require('../middleware/auth');

const router = express.Router();


router.post('/signup', UserController.signup);

router.post('/login', UserController.login);

router.put('/updateUserDetails', Userauthentication.authenticate, UserController.updateUserDetails);


module.exports = router;
