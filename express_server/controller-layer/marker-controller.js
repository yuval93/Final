const express = require("express");
const marker_dal = require("../data-access-layer/marker-dal");
const MarkerModel = require("../models/marker-model");
const log = require("../middleware/logger");

// const verifyLoggedIn = require("../middleware/verify-logged-in.js");

const router = express.Router();

// router.use(log);

// GET ALL
router.get("", async (request, response) => {
    try {
        const markers = await marker_dal.getAllMarkers();

        response.json(markers);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// GET ONE
router.get("/:id", [log], async (request, response) => {
    try {
        const _id = request.params.id;
        const marker = await marker_dal.getOneMarker(_id);

        if (!marker) {
            response.status(404).send(`ID '${_id}' doesn't exist`);
            return;
        }

        response.json(marker);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// POST
// router.post("", verifyLoggedIn, async (request, response) => {
router.post("", async (request, response) => {

    try {
        // - ADD VALIDATIONS
        // 1. Create 'MarkerModel' object from 'request.body'
        const markerModel = new MarkerModel(request.body);

        // 2. Run validations (specific to MarkerModel)
        const errorMessages = markerModel.validateSync(); // Exepcted validation errors

        // 3. Send status 400 if validations fail including the messages created by JOI
        if (errorMessages) {
            response.status(400).send(errorMessages);
            return;
        }

        // Handle files (request.files)
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        const newMarker = await marker_dal.addMarker(markerModel, image);

        // 7. Return new marker object created
        response.status(201).json(newMarker);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// PUT
router.put("/:id", log, async (request, response) => {

    // Statuses:
    // - 200 (Success)
    // - 404 (doesn't exist)
    // - 400 (validation)
    // - 500 (internal server error - catch area)

    try {
        // Implmentation + Validation
        // 1. Create MarkerModel
        const markerId = request.params.id;
        const updatedMarker = new MarkerModel(request.body); // Call 'constructor'
        updatedMarker._id = markerId; // Add property to JS object

        // 2. Run validations
        const errorMessages = updatedMarker.validateSync(); // Exepcted validation errors

        // 3. Send status 400 if validations fail including the messages created by JOI
        if (errorMessages) {
            response.status(400).send(errorMessages);
            return;
        }

        // Handle image
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        // 4. If success, try update the database
        const result = await marker_dal.updateMarker(updatedMarker, image);
        if (result === null) {
            response.status(404).send(`Marker with ID ${markerId} doesn't exist.`);
            return;
        }

        // 5. Return the updated marker created
        response.json(result); // Status = 200

    } catch (err) {
        response.status(500).send(err.message);
    }
});

// PATCH
router.patch("/:id", async (request, response) => {

    try {

        // 1. Capture markerID and marker details from URL and FORM
        const markerId = request.params.id;

        // 2. Find element in database => Find index of element with ID in the 'database' array
        const marker = await marker_dal.getOneMarker(markerId);

        // 3. Replace marker details with 'newMarker' at the 'index' found in no. 2
        for (let key in request.body)
            marker[key] = request.body[key];

        const errorMessages = marker.validateSync(); // Exepcted validation errors
        if (errorMessages) return response.status(400).send(errorMessages);

        const image = request.files && request.files.image ? request.files.image : null;

        const updatedMarker = await marker_dal.patchMarker(markerId, request.body, image);

        // 4. Return the updated marker created
        response.json(updatedMarker);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// DELETE
router.delete("/:id", async (request, response) => {
    try {
        const id = request.params.id; // Get book id.

        const result = await marker_dal.deleteMarker(id);
        if (!result) {
            response.status(404).send(`Marker with ID ${id} doesn't exist.`);
            return;
        }

        response.sendStatus(204); // Response status 204 with empty body.
    } catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;