const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authentication');

// User authentication routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

router.get('/profile', authenticateUser, userController.getUserProfile);
router.put('/profile', authenticateUser, userController.updateUserProfile);

// Protected routes for users
router.get('/user', authenticateUser, userController.getUserDetails);
router.put('/user', authenticateUser, userController.updateUserDetails);
router.delete('/user', authenticateUser, userController.deleteUserAccount);

module.exports = router;