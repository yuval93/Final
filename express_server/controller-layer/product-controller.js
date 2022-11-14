const express = require("express");
const product_dal = require("../data-access-layer/product-dal");
const ProductModel = require("../models/product-model");
const log = require("../middleware/logger");

// const verifyLoggedIn = require("../middleware/verify-logged-in.js");

const router = express.Router();

// router.use(log);

// GET ALL
router.get("", async (request, response) => {
    try {
        const products = await product_dal.getAllProducts();

        response.json(products);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// GET ONE
router.get("/:id", [log], async (request, response) => {
    try {
        const _id = request.params.id;
        const product = await product_dal.getOneProduct(_id);

        if (!product) {
            response.status(404).send(`ID '${_id}' doesn't exist`);
            return;
        }

        response.json(product);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// POST
// router.post("", verifyLoggedIn, async (request, response) => {
router.post("", async (request, response) => {

    try {
        // - ADD VALIDATIONS
        // 1. Create 'ProductModel' object from 'request.body'
        console.log("------------")
        console.log(request.body);
        console.log("------------")
        const productModel = new ProductModel(request.body);

        // 2. Run validations (specific to ProductModel)
        const errorMessages = productModel.validateSync(); // Exepcted validation errors

        // 3. Send status 400 if validations fail including the messages created by JOI
        if (errorMessages) {
            response.status(400).send(errorMessages);
            return;
        }

        // Handle files (request.files)
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        const newProduct = await product_dal.addProduct(productModel, image);

        // 7. Return new product object created
        response.status(201).json(newProduct);
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
        // 1. Create ProductModel
        const productId = request.params.id;
        const updatedProduct = new ProductModel(request.body); // Call 'constructor'
        updatedProduct._id = productId; // Add property to JS object

        // 2. Run validations
        const errorMessages = updatedProduct.validateSync(); // Exepcted validation errors

        // 3. Send status 400 if validations fail including the messages created by JOI
        if (errorMessages) {
            response.status(400).send(errorMessages);
            return;
        }

        // Handle image
        const image = request.files && request.files.image ? request.files.image : null;
        if (!image) return response.status(400).send("Missing image.");

        // 4. If success, try update the database
        const result = await product_dal.updateProduct(updatedProduct, image);
        if (result === null) {
            response.status(404).send(`Product with ID ${productId} doesn't exist.`);
            return;
        }

        // 5. Return the updated product created
        response.json(result); // Status = 200

    } catch (err) {
        response.status(500).send(err.message);
    }
});

// PATCH
router.patch("/:id", async (request, response) => {

    try {

        // 1. Capture productID and product details from URL and FORM
        const productId = request.params.id;
        console.log("productId for patch", productId)

        // 2. Find element in database => Find index of element with ID in the 'database' array
        const product = await product_dal.getOneProduct(productId);
        console.log("prodbring product for patch", product)

        // 3. Replace product details with 'newProduct' at the 'index' found in no. 2
        for (let key in request.body)
            product[key] = request.body[key];

        console.log("prodbring product for patch after", product)

        // const errorMessages = product.validateSync(); // Exepcted validation errors
        // if (errorMessages) return response.status(400).send(errorMessages);

        const image = request.files && request.files.image ? request.files.image : null;

        const updatedProduct = await product_dal.updateProduct(product, image);





        // 4. Return the updated product created
        response.json(updatedProduct);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// DELETE
router.delete("/:id", async (request, response) => {
    try {
        const id = request.params.id; // Get book id.

        const result = await product_dal.deleteProduct(id);
        if (!result) {
            response.status(404).send(`Product with ID ${id} doesn't exist.`);
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
        const arr = await product_dal.getProductsByRange(+request.params.min, +request.params.max);
        if (arr.length === 0) {
            response.sendStatus(204);
            return;
        }

        response.json(arr);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

// GET http://localhost:3001/api/products/images/7.jpg
router.get("/images/:name", (request, response) => {
    try {
        const fileName = request.params.name;
        const filePath = product_dal.getProductImage(fileName);

        response.sendFile(filePath);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});
// GET all categories http://localhost:3001/api/products/categories
router.get("/categories/all", async (request, response) => {
    try {
        const categories = await product_dal.getAllCategories();
        response.json(categories);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET PRODUCT COUNT 
// router.get("/countproducts", async (request, response) => {
//     try {
//         const products = await product_dal.getAllProducts();

//         response.json(products);
//     } catch(err) {
//         response.status(500).send(err.message);
//     }
// });

// console.log( Object.keys(procuts).length);




module.exports = router;