// Import necessary libraries and modules
const jwt = require('jsonwebtoken');
const { SECRET } = require("../../config"); // Replace with your actual secret key

// Define your middleware function
function authenticateJWT(req, res, next) {
    // Get the JWT token from the request (e.g., from a cookie or an Authorization header)
    const token = req.cookies.jwtToken || req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }

    // Verify the token using your secret key
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Authentication failed. Invalid token.' });
        }
        // If the token is valid, you can attach the user object to the request for later use in route handlers
        req.user = user;

        // Continue to the next middleware or route handler
        next();
    });
}

module.exports = authenticateJWT;