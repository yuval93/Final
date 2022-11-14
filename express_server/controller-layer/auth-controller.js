const express = require("express");
const UserModel = require("../models/user-model");
const auth_dal = require("../data-access-layer/auth-dal");
const { log } = require("console");

const router = express.Router();

router.post("/register", async (request, response) => {
    try {

        // 1. Create 'UserModel' that contains first_name, last_name, username, password
        const user = new UserModel(request.body);

        // 2. Validate form (JOI)
        // ... [Homework]

        // X. Check that username doesn't exist in DB

        // 3. Call DAL and send UserModel
        const registeredUser = await auth_dal.register(user);

        // 8. Return to client
        response.json(registeredUser);
    } catch(err) {
        response.status(500).send(err.message);
    }
});

// LOGIN
router.post("/login", async (request, response) => {

    try {
        // 1. Create 'UserModel' that contains username, password
        const user = new UserModel(request.body);

        // 2. Validate form (JOI)
        // ... [Homework]
        
        // 3. Call DAL and send UserModel
        const loggedInUser = await auth_dal.login(user);
        if (!loggedInUser) {
            response.status(401).send("Credentials incorrect!");
        }

        // 8. Return to client
        response.json(loggedInUser);

    } catch(err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;