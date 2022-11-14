const fs = require("fs");
const path = require("path");
const socketLogic = require("../controller-layer/socket-logic");

const mongoose = require("mongoose");
require("./mongodb-access");

// NEED TO REMOVE 'database'
const ProductModel = require("../models/product-model"); // mongoose ProductModel
const CategoryModel = require("../models/category-model");

async function getAllProducts() {
    // Ignore virtual fields, except for default ones, such as 'id'
    // return await ProductModel.find().exec();

    // Fill virtual field 'category' with the relevant model, in this case "CategoryModel"
    // return await ProductModel.find().exec();
    return await ProductModel.find().populate("category").exec();
}

async function getOneProduct(productId) {
    const product = await ProductModel.findById(productId).populate("category").exec();

    return product;
}

async function updateProduct(product, image) {

    // Save the image to disk:
    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const fileName = product.id + extension; // '99.JPG'
        product.imageName = fileName;

        // Save file to a dedicated folder 'C:/...../data-access-layer/../images/products/99.JPG'
        const absolutePath = path.join(__dirname, "/../../", "upload", fileName);
        image.mv(absolutePath); // Save the file to the path
    }

    const result = await ProductModel.updateOne({ _id: product._id }, product).exec();

    // Check if the id was not found, if so, return null
    if (result.matchedCount === 0) {
        return null;
    } else {
        // Check if data was changed
        if (result.modifiedCount === 0) {
            // Do nothing
        }
        socketLogic.emitUpdateProduct(product);

        return product;
    }
}

async function patchProduct(productId, changes, image) {

    // Add 'image' handling functionality - TODO
    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const fileName = productId + extension; // '99.JPG'
        changes.imageName = fileName;

        // Save file to a dedicated folder 'C:/...../data-access-layer/../images/products/99.JPG'
        const absolutePath = path.join(__dirname, "/../../", "upload", fileName);
        image.mv(absolutePath); // Save the file to the path
    }

    const updatedProduct = await ProductModel.updateOne({ _id: productId }, { $set: changes }).exec();
    socketLogic.emitUpdateProduct(updatedProduct);

    return updatedProduct;
}

async function addProduct(product, image) {

    // Save the image to disk:
    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const fileName = product.id + extension; // '99.JPG'
        product.imageName = fileName;

        // Save file to a dedicated folder 'C:/...../data-access-layer/../images/products/99.JPG'
        const absolutePath = path.join(__dirname, "/../../", "upload", fileName);
        await image.mv(absolutePath); // Save the file to the path
    }

    // product = mongoose.model(product, ProductModel.ProductScheme);
    // product.catrgoryId = product.catrgoryId;
    // const category = await CategoryModel.findById(product.categoryId)
    // console.log(category);
    // product.categoryId = require('mongoose').Types.ObjectId;

    console.log(product);
    product.save();

    // 3. Return new product
    socketLogic.emitAddProduct(product);
    return product;
}

async function getProductsByRange(min, max) {
    const products = await ProductModel.find({ price: { $gte: min, $lte: max } }).exec();
    return products;
}

function getProductImage(imageName) {
    let absolutePath = path.join(__dirname, "/../../", "upload", imageName);
    if (!fs.existsSync(absolutePath)) {
        absolutePath = path.join(__dirname, "/../../", "upload", "not-found.jpg");
    }

    return absolutePath;
}

async function deleteProduct(_id) {
    const result = await ProductModel.deleteOne({ _id }).exec();

    // console.log(result);

    socketLogic.emitDeleteProduct(_id);
    return result.deletedCount === 1 ? true : false;

    // const fileName = id + ".jpg";
    // const absolutePath = path.join(__dirname, "/../../", "upload", fileName);

    // try {
    //     if(fs.existsSync(absolutePath)) {
    //         fs.unlinkSync(absolutePath);
    //     }
    // } catch(err) {
    //     console.log(err);
    // }

    return true;
}

// Get all categories
function getAllCategories() {

    // Get all categories without virtual fields: 
    // return CategoryModel.find().exec();

    // Get all categories with virtual fields: 
    return CategoryModel.find().populate("products").exec();

}

//Get number of products
// async function getProductsCount(){

//     // const procutCount =  await ProductModel.countDocuments((count) => count);
//     // const procuts =  await ProductModel.find();
//     // return Object.keys(procuts).length;

// }



/// activate if you want to manually insert product 


module.exports = {
    getOneProduct,
    addProduct,
    getAllProducts,
    updateProduct,
    getProductsByRange,
    getProductImage,
    deleteProduct,
    patchProduct,
    getAllCategories
    // getProductsCount
}