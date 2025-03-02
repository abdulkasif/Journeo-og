const express = require('express');
const { createUser, getAllUser, getUserByPhone } = require('../controllers/userController');

const router = express.Router();

router.post('/create', createUser);
router.get('/get', getAllUser);
router.post('/login',getUserByPhone);

module.exports = router;