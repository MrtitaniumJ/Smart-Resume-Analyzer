const express = require('express');
const resumeRoutes = require('./routes/resumeRoutes');
const userRoutes = require('./routes/userRoutes');

const router = express.Router();

//Mounting routes
router.use('/api', resumeRoutes);
router.use('/api', userRoutes);

module.exports = router;