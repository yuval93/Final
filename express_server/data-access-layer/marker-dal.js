const fs = require("fs");
const mongoose = require("mongoose");
require("./mongodb-access");

const MarkerModel = require("../models/marker-model"); // mongoose MarkerModel

async function getAllMarkers() {
    return await MarkerModel.find().exec();
}

async function getOneMarker(markerId) {
    const marker = await MarkerModel.findById(markerId).exec();
    return marker;
}

async function updateMarker(marker, image) {

    const result = await MarkerModel.updateOne({ _id: marker._id }, marker).exec();

    // Check if the id was not found, if so, return null
    if (result.matchedCount === 0) {
        return null;
    } else {
        // Check if data was changed
        if (result.modifiedCount === 0) {
            // Do nothing
        }
        return marker;
    }
}

async function patchMarker(markerId, changes, image) {

    const updatedMarker = await MarkerModel.updateOne({ _id: markerId }, { $set: changes }).exec();

    return updatedMarker;
}

async function addMarker(marker) {
    marker.save();
    // 3. Return new marker
    return marker;
}



async function deleteMarker(_id) {
    const result = await MarkerModel.deleteOne({ _id }).exec();
    return result.deletedCount === 1 ? true : false;
    return true;
}


module.exports = {
    getOneMarker,
    addMarker,
    getAllMarkers,
    updateMarker,
    deleteMarker,
    patchMarker,
}