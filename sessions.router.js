const express = require('express');
const router = express.Router();
const endpoints = require('./session.controller');

router.post('/login', endpoints.login);
router.post('/user', endpoints.create);
router.delete('/logout', endpoints.logout);

module.exports = router;
