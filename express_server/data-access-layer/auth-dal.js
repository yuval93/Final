const jwt = require("jsonwebtoken");
const crypto = require("../helpers/crypto-helper");
const uuid = require("uuid");
const UserModel = require("../models/user-model");

async function login(user) {
    /// ---- DAL ----
    // X. Encrypt password using HASHING
    user.password = crypto.hash(user.password);

    const loggedInUser = await UserModel.findOne({username: user.username, password: user.password}).exec();
    if (!loggedInUser) {
        return null;
    }

    loggedInUser.token = jwt.sign({ loggedInUser }, config.secretJwtKey, { expiresIn: "30m" });

    // 6. Remove password from UserModel
    delete loggedInUser.password;
    
    // 7. Return UserModel to Controller
    return loggedInUser;
}

async function register(user) {
    /// ---- DAL ----
    // X. Encrypt password using HASHING
    user.password = crypto.hash(user.password);

    user.save();

    // 5. Create Token and add to 'UserModel'
    user.token = jwt.sign({ user }, config.secretJwtKey, { expiresIn: "30m" });

    // 6. Remove password from UserModel
    delete user.password;
    
    // 7. Return UserModel to Controller
    return user;
}

module.exports = {
    login,
    register
}