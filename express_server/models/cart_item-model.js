const mongoose = require("mongoose");
const CategoryModel = require("./category-model");

// 1. Define schema (Cart_itemModel properties + DB field definitions / structure)
// 2. Add validations to the schema
const Cart_itemScheme = mongoose.Schema({
     cart_itemId: { // Foreign Key to categories collection.
        type: mongoose.Schema.Types.ObjectId
    },
     cartId: { // Foreign Key to categories collection.
        type: mongoose.Schema.Types.ObjectId
    },
    quantity: { // Foreign Key to categories collection
       type: Number,
        required: [true, "Price is required."],
        min: [0, "Price must be a positive number."],
        max: [1000, "Price cannot exceed 1000."]
    },
    price: { // Foreign Key to categories collection
       type: Number,
        required: [true, "Price is required."],
        min: [0, "Price must be a positive number."],
        max: [1000, "Price cannot exceed 1000."]
    },
    total_cost: {
        type: Number,
        required: [true, "Price is required."],
        min: [0, "Price must be a positive number."],
        max: [1000, "Price cannot exceed 1000."]
    } 
}, { versionKey: false, toJSON: {virtuals: true}});

// Virtual Field
Cart_itemScheme.virtual("cart_items", {
    localField: "cart_itemId", // Which local filed connects to that relation.
    ref: "Cart_itemModel", // Which model to create relation to?
    foreignField: "_id", // Which foreign filed connects to tha relation.
});

// 3. Create Mongoose Model with scheme defined above
const Cart_itemModel = mongoose.model("Cart_itemModel", Cart_itemScheme, "cart_items");

// 4. Return Mongoose Model (module.exports)
module.exports = Cart_itemModel;