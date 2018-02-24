const express = require('express');

const router = express.Router();
const checkAuth = require('../middlware/check-auth');

const UserController = require('../controllers/user');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

router.get('/', UserController.users_get_all);

module.exports = router;