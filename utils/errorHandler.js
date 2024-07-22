const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const errorDetails = {
        message: err.message,
    };

    if (process.env.NODE_ENV === 'development') {
        errorDetails.error = err.stack;
    }

    res.status(err.status || 500).json(errorDetails);
};

module.exports = errorHandler;
