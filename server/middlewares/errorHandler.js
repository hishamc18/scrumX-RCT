const errorHandler = ((err, req, res, next) => {
    // Log the error (for debugging purposes)
    console.error(err.stack);
    // Set the status code and send a JSON response.
    res.status(err.statusCode || 500).json({
      message: err.message || "Something broke!",
    });
  });


  module.exports = errorHandler