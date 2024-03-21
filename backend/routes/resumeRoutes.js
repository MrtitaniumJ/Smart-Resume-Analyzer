const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authService = require('../middleware/authentication');
const fileUpload = require('../middleware/fileUpload');

router.use(authService.authenticateUser);

router.post('/upload', fileUpload, resumeController.uploadResume);
router.post('/:resumeId/analyze', resumeController.analyzeResume);

module.exports = router;