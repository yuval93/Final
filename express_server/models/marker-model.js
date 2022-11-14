const mongoose = require("mongoose");

const MarkerSchema = mongoose.Schema({
    lat: { type: Number },
    lng: { type: Number },
    label: { type: String },
    draggable: { type: Boolean },
}, { versionKey: false, toJSON: { virtuals: true }, id: true });

const MarkerModel = mongoose.model("MarkerModel", MarkerSchema, "markers");

module.exports = MarkerModel;

