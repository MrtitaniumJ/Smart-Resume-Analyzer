const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const resume = require('../models/resume');

// Controller function to handle user registration
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        // console.log(username,email,password,confirmPassword);

        // Check if the required fields are provided
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'Please provide username, email, password, and confirmPassword' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        // Create a new user instance
        const newUser = new User({ username, email, password: hashedPassword, confirmPassword: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user: ', error);
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
};

// Controller function to handle user login 
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Ensure that the JWT_SECRET is provided and valid
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'JWT secret is missing or invalid' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user: ', error);
        res.status(500).json({ error: 'An error occurred while logging in user' });
    }
};

// Controller function to get user details
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate('uploadedResumes');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'An error occurred while fetching user details' });
    }
};

// get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        // const user = await User.findById(userId).populate('uploadedResumes');
        const user = await User.findById(userId);

        const resumes = await resume.find({ userId: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = {
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            uploadedResumes: resumes.map(resume => ({
                resumeId: resume._id,
                filename: resume.filename,
            })),
        };
        
        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile: ', error);
        res.status(500).json({ error: error.message || 'An error occurred while fetching user profile' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        //extract user data from the request body
        const { username, email, profileImage, uploadedResumes } = req.body;

        // update user profile in the database
        await User.findByIdAndUpdate(userId, {
            username: username,
            email: email,
            profileImage: profileImage,
            uploadedResumes: uploadedResumes,
        });

        res.json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to update user details
exports.updateUserDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user details: ', error);
        res.status(500).json({ error: 'An error occurred while updating user details ' });
    }
};

// Controller function to delete user account
exports.deleteUserAccount = async (req, res) => {
    try {
        const userId = req.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ error: 'An error occurred while deleting user account' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        //clear the JWT token on the client-side
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user: ', error);
        res.status(500).json({ error: 'An error occurred while logging out user' });
    }
};

// Other controller functions for user-related operations
