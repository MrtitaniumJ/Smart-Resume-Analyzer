// Error handler for handling validation errors
exports.validationError =  (err, req, res, next) => {
    if (err.name == 'ValidationError') {
        const errors = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({ error: errors });
    }
    next(err);
};

//Global error handler for handling all other errors
exports.globalErrorHandler = (err, req, res, next) => {
    console.error('Error: ', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};