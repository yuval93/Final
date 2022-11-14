const mongoose = require("mongoose");

// 1. Define schema (ProductModel properties + DB field definitions / structure)
// 2. Add validations to the schema
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true],
        min: [3],
        max: [50]
    },
    lastName: {
        type: String,
        required: [true],
        min: [3],
        max: [50]
    },
    username: {
        type: String,
        required: [true],
        min: [3],
        max: [20]
    },
    password: {
        type: String,
        required: [true],
        min: [6],
        max: [8]
    },
    // role: { type: String, 
    // required: true, 
    // enum: ['customer', 'admin'] },

}, { versionKey: false, toJSON: {virtuals: true}});

// 3. Create Mongoose Model with scheme defined above
const UserModel = mongoose.model("UserModel", UserSchema, "users");

// 4. Return Mongoose Model (module.exports)
module.exports = UserModel;