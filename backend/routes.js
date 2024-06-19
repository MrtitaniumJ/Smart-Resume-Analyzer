const express = require('express');
const resumeRoutes = require('./routes/resumeRoutes');
const userRoutes = require('./routes/userRoutes');

const router = express.Router();

//Mounting routes
router.use(resumeRoutes);
router.use(userRoutes);

module.exports = router;