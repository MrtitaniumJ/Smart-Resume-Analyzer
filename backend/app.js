const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { validationError, globalErrorHandler } = require('./utils/errorHandlers');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

// Implement models
const { User, Resume } = require('./models');

// Connect to MongoDB
mongoose.connect('mongodb+srv://jkjatinsharma72:resume-analyser@cluster0.m7ldc4t.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected  to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);
});

// Middleware 
app.use(bodyParser.json());

//Routes 
app.use(routes);

//Error handling middleware
app.use(validationError);
app.use(globalErrorHandler);

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

// Other middleware and routes
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;