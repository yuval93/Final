const mongoose = require("mongoose");

// 1. Define schema (ProductModel properties + DB field definitions / structure)
// 2. Add validations to the schema
const ProductScheme = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        minlength: [2, "Name must be at least 2 characters long."],
        maxlength: [100, "Name cannot exceed 100 characters."]
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
        min: [0, "Price must be a positive number."],
        max: [1000, "Price cannot exceed 1000."]
    },  
 
    imageName: String,
      categoryId: { // Foreign Key to categories collection.
        type: mongoose.Schema.Types.ObjectId
    }
}, { versionKey: false, toJSON: { virtuals: true }, id: true });

// Virtual Field
ProductScheme.virtual("category", {
    localField: "categoryId", // Which local filed connects to that relation.
    ref: "CategoryModel", // Which model to create relation to?
    foreignField: "_id", // Which foreign filed connects to tha relation.
    justOne: true // category field should be one object and not array.
});


ProductScheme.virtual("supllier", {
    localField: "supllierId", // Which local filed connects to that relation.
    ref: "SupllierModel", // Which model to create relation to?
    foreignField: "_id", // Which foreign filed connects to tha relation.
    justOne: true // supllier field should be one object and not array.
});

// 3. Create Mongoose Model with scheme defined above
const ProductModel = mongoose.model("ProductModel", ProductScheme, "products");

// 4. Return Mongoose Model (module.exports)
module.exports = ProductModel;