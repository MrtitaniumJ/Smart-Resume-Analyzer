require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const resumeRoutes = require('./routes/resumeRoutes');
const userRouter = require('./routes/userRoutes');
const { validationError, globalErrorHandler } = require('./utils/errorHandlers');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-resume-analyser', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);
});

// Routes
app.use(userRouter);
app.use(resumeRoutes);
app.use(routes);

// Error handling middleware
app.use(validationError);
app.use(globalErrorHandler);

// Static files
app.use('/profile-images', express.static('profile-images'));

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.log('Uncaught Exception: ', error);
    process.exit(1);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection: ', error);
    process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
