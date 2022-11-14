const mongoose = require("mongoose");

const SupllierSchema = mongoose.Schema({
    name: String,
}, { versionKey: false, toJSON: { virtuals: true }, id: true });

SupllierSchema.virtual("products", {
    localField: "_id", // relation's local field
    ref: "ProductModel", // Model?
    foreignField: "supllierId" // relation's foreign field
});

const SupllierModel = mongoose.model("SupllierModel", SupllierSchema, "suplliers");

module.exports = SupllierModel;



