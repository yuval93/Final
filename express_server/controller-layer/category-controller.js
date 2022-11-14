const express = require("express");
const category_dal = require("../data-access-layer/category-dal");
const CategoryModel = require("../models/category-model");
const log = require("../middleware/logger");

// const verifyLoggedIn = require("../middleware/verify-logged-in.js");

const router = express.Router();

// router.use(log);

// GET ALL
router.get("", async (request, response) => {
    try {
        const categorys = await category_dal.getAllCategorys();

        response.json(categorys);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// GET ONE
router.get("/:id", [log], async (request, response) => {
    try {
        const _id = request.params.id;
        const category = await category_dal.getOneCategory(_id);

        if (!category) {
            response.status(404).send(`ID '${_id}' doesn't exist`);
            return;
        }

        response.json(category);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// POST
// router.post("", verifyLoggedIn, async (request, response) => {
router.post("", async (request, response) => {

    try {
        // - ADD VALIDATIONS
        // 1. Create 'CategoryModel' object from 'request.body'
        const categoryModel = new CategoryModel(request.body);

        // 2. Run validations (specific to CategoryModel)
        const errorMessages = categoryModel.validateSync(); // Exepcted validation errors

        // 3. Send status 400 if validations fail including the messages created by JOI
        if (errorMessages) {
            response.status(400).send(errorMessages);
            return;
        }

        // Handle files (request.files)
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        const newCategory = await category_dal.addCategory(categoryModel, image);

        // 7. Return new category object created
        response.status(201).json(newCategory);
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
        // 1. Create CategoryModel
        const categoryId = request.params.id;
        const updatedCategory = new CategoryModel(request.body); // Call 'constructor'
        updatedCategory._id = categoryId; // Add property to JS object

        // 2. Run validations
        const errorMessages = updatedCategory.validateSync(); // Exepcted validation errors

        // 3. Send status 400 if validations fail including the messages created by JOI
        if (errorMessages) {
            response.status(400).send(errorMessages);
            return;
        }

        // Handle image
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        // 4. If success, try update the database
        const result = await category_dal.updateCategory(updatedCategory, image);
        if (result === null) {
            response.status(404).send(`Category with ID ${categoryId} doesn't exist.`);
            return;
        }

        // 5. Return the updated category created
        response.json(result); // Status = 200

    } catch (err) {
        response.status(500).send(err.message);
    }
});

// PATCH
router.patch("/:id", async (request, response) => {

    try {

        // 1. Capture categoryID and category details from URL and FORM
        const categoryId = request.params.id;

        // 2. Find element in database => Find index of element with ID in the 'database' array
        const category = await category_dal.getOneCategory(categoryId);

        // 3. Replace category details with 'newCategory' at the 'index' found in no. 2
        for (let key in request.body)
            category[key] = request.body[key];

        const errorMessages = category.validateSync(); // Exepcted validation errors
        if (errorMessages) return response.status(400).send(errorMessages);

        const image = request.files && request.files.image ? request.files.image : null;

        const updatedCategory = await category_dal.patchCategory(categoryId, request.body, image);

        // 4. Return the updated category created
        response.json(updatedCategory);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// DELETE
router.delete("/:id", async (request, response) => {
    try {
        const id = request.params.id; // Get book id.

        const result = await category_dal.deleteCategory(id);
        if (!result) {
            response.status(404).send(`Category with ID ${id} doesn't exist.`);
            return;
        }

        response.sendStatus(204); // Response status 204 with empty body.
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// FILTER PRICE BY RANGE
router.get("/price-range/:min/:max", async (request, response) => {
    try {
        const arr = await category_dal.getCategorysByRange(+request.params.min, +request.params.max);
        if (arr.length === 0) {
            response.sendStatus(204);
            return;
        }

        response.json(arr);
    } catch (err) {
        response.status(500).send(err.message);
    }

});

// GET http://localhost:3030/api/categorys/images/7.jpg
router.get("/images/:name", (request, response) => {
    try {
        const fileName = request.params.name;
        const filePath = category_dal.getCategoryImage(fileName);

        response.sendFile(filePath);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET all categories http://localhost:3030/api/categories/products/all
router.get("/products/all", async (request, response) => {
    try {
        const products = await category_dal.getAllProducts();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET all categories http://localhost:3030/api/categories/products/agg
router.get("/products/agg", async (request, response) => {
    try {
        const products = await category_dal.getAggProducts();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});
// GET all categories http://localhost:3030/api/categories/products/agg-supllier
router.get("/products/agg-supllier", async (request, response) => {
    try {
        const products = await category_dal.getAggSupplierProducts();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET all categories http://localhost:3030/api/categories/products/map
router.get("/products/map", async (request, response) => {
    try {
        const products = await category_dal.getMapCategorys();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});





// // FILTER By CATEGORY & PRICE RANGE 
// Example: http://localhost:3030/api/categories/62daa3222eaa3cc42d391b4e/20/40

router.get("/:id/:min/:max", [log], async (request, response) => {
    try {
        const _id = request.params.id;
        const min = +request.params.min;
        const max = +request.params.max;
        const category = await category_dal.getOneCategory(_id);
        const products = category.products;
        const filtered = products.filter(product => product.price > min && product.price < max);

        if (!category) {
            response.status(404).send(`ID '${_id}' doesn't exist`);
            return;
        }

        response.json(filtered);
    } catch (err) {
        response.status(500).send(err.message);
    }
});


module.exports = router;