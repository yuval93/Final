const jwt = require("jsonwebtoken");

function verifyLoggedIn(request, response, next) {

    // 1. Check if header containing the token exists (Header = "Authorization")
    if (!request.headers.authorization) {
        return response.status(401).send("You are not authorized to access this resource.");
    }

    // 2. Check if correctly structured token exists ("Bearer {token}")
    const token = request.headers.authorization.split(" ")[1];
    if (!token) {
        return response.status(401).send("You are not authorized to access this resource.");
    }

    // 3. Check if Token is valid (using JWT). If all is well, 'next()'
    jwt.verify(token, config.secretJwtKey, (err, payload) => {
        
        // A. If 'err' exists: [1] Token expired, [2] All else
        if (err && err.message === "jwt expired") {
            return response.status(403).send("Your session has expired.");
        }

        if (err) {
            return response.status(401).send("You are not authorized to access this resource.");
        }

        // B. If all is well, 'next()'
        next();
    });
}

module.exports = verifyLoggedIn;