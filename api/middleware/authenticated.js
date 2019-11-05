const mongoose = require("mongoose");

const User = mongoose.model("users");

/**
 * @summary - It will retrieve the auth token cookie from the request.
 * It will then process the token to check for validity and forward the user to the route controller if it is. Otherwise it will respond with a 401 Error.
 * @param {token} req - It will receive the auth token through a cookie.
 * The token and user object will be defined in the request object if the user is authenticated
 * @param res - Will be unchanged if the user is authenticated, the request will be forwarded to the route controllers.
 * @param next - Express callback function that will forward the route to the next controller
 */
let authenticated = (req, res, next) => {
    const token = (req.headers["authorization"] || "").replace("Bearer ", "");
    if (!token) {
        return res.status(401).send({
            error: "User must be logged in",
        });
    }
    User.findByToken(token)
        .then(user => {
            if (!user) {
                return Promise.reject();
            }
            req.user = user;
            req.token = token;

            next();
        })
        .catch(e => {
            return res.status(401).send({
                error: "Invalid credentials provided. Acquire new credentials.",
            });
        });
};

const checkSignature = (req, res, next) => {
    const token = (req.headers["authorization"] || "").replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, keys.jwtSecret);
        req.body = decoded;
        next();
    } catch (error) {
        res.cookie("x-auth", "", { maxAge: Date.now() });
        return res.status(401).send({ error: "Invalid auth token" });
    }
};

module.exports = {
    authenticated,
    checkSignature,
};
