const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
require("./mongodb-access");

// NEED TO REMOVE 'database'
const CategoryModel = require("../models/category-model"); // mongoose CategoryModel
const ProductModel = require("../models/product-model"); // mongoose ProductModel
const SupllierModel = require("../models/supllier-model"); // mongoose SupllierModel

async function getAllCategorys() {
    // Ignore virtual fields, except for default ones, such as 'id'
    // return await CategoryModel.find().exec();

    // Fill virtual field 'category' with the relevant model, in this case "CategoryModel"
    // return await CategoryModel.find().exec();
    return await CategoryModel.find().populate("products").exec();
}

async function getOneCategory(categoryId) {
    const category = await CategoryModel.findById(categoryId).populate("products").exec();

    return category;
}

async function updateCategory(category, image) {

    // Save the image to disk:
    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const fileName = category.id + extension; // '99.JPG'
        category.imageName = fileName;

        // Save file to a dedicated folder 'C:/...../data-access-layer/../images/categorys/99.JPG'
        const absolutePath = path.join(__dirname, "..", "images", "categorys", fileName);
        image.mv(absolutePath); // Save the file to the path
    }

    const result = await CategoryModel.updateOne({ _id: category._id }, category).exec();

    // Check if the id was not found, if so, return null
    if (result.matchedCount === 0) {
        return null;
    } else {
        // Check if data was changed
        if (result.modifiedCount === 0) {
            // Do nothing
        }

        return category;
    }
}

async function patchCategory(categoryId, changes, image) {

    // Add 'image' handling functionality - TODO
    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const fileName = categoryId + extension; // '99.JPG'
        changes.imageName = fileName;

        // Save file to a dedicated folder 'C:/...../data-access-layer/../images/categorys/99.JPG'
        const absolutePath = path.join(__dirname, "..", "images", "categorys", fileName);
        image.mv(absolutePath); // Save the file to the path
    }

    const updatedCategory = await CategoryModel.updateOne({ _id: categoryId }, { $set: changes }).exec();

    return updatedCategory;
}

async function addCategory(category, image) {

    // Save the image to disk:
    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        const fileName = category.id + extension; // '99.JPG'
        category.imageName = fileName;

        // Save file to a dedicated folder 'C:/...../data-access-layer/../images/categorys/99.JPG'
        const absolutePath = path.join(__dirname, "..", "images", "categorys", fileName);
        await image.mv(absolutePath); // Save the file to the path
    }

    category.save();

    // 3. Return new category
    return category;
}

async function getCategorysByRange(min, max) {
    const categorys = await CategoryModel.find({ price: { $gte: min, $lte: max } }).exec();

    return categorys;
}

function getCategoryImage(imageName) {
    let absolutePath = path.join(__dirname, "..", "images", "categorys", imageName);
    if (!fs.existsSync(absolutePath)) {
        absolutePath = path.join(__dirname, "..", "images", "not-found.jpg");
    }

    return absolutePath;
}

async function deleteCategory(_id) {
    const result = await CategoryModel.deleteOne({ _id }).exec();

    // console.log(result);

    return result.deletedCount === 1 ? true : false;

    // const fileName = id + ".jpg";
    // const absolutePath = path.join(__dirname, "..", "images", "categorys", fileName);

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
async function getAllProducts() {

    // Get all categories without virtual fields: 
    // return CategoryModel.find().exec();

    // Get all categories with virtual fields: 
    // return CategoryModel.find().populate("products").exec();
    return await ProductModel.find().populate("category").exec();

}


// Get all Products By categories using GroupBy
async function getAggProducts() {

    // Get all categories without virtual fields: 
    // return CategoryModel.find().exec();

    // Get all categories with virtual fields: 
    // return CategoryModel.find().populate("products").exec();

    // return await ProductModel.find().exec();
    // return await ProductModel.find().populate("category").exec();


    const countProducts = await ProductModel.aggregate([
        { $group: { _id: "$categoryId", count: { $sum: 1 } } }
    ]).exec();


    for (const element of countProducts) {
        // console.log(element);
        // console.log("-----------------");
        // console.log(element["_id"]);
        let cat = await getOneCategory(element["_id"])
        // console.log("____________________");
        // console.log("cat");
        // console.log(cat);
        element.name = cat.name
        console.log(element);
    }

    // console.log(countProducts)
    return countProducts

}
async function getAggSupplierProducts() {

    const countProducts = await ProductModel.aggregate([
        { $group: { _id: "$supllierId", count: { $sum: 1 } } }
    ]).exec();

    // let allsup = await SupllierModel.find().exec();

    // console.log("____________________");
    // console.log("allsup");
    // console.log(allsup);
    // for (const element of allsup) {
    //     console.log("----Object.entries(element)---");
    //     console.log(Object.entries(element)[5][1].name);
    //     // console.log("-------");
    //     // console.log(element);

    // }

    for (const element of countProducts) {
        // console.log(element);
        // console.log("-----------------");
        // console.log(element["_id"]);
        let sup = await SupllierModel.findById(element["_id"]).exec();
        // let sup = allsup.find(x => x[" _id"] == element["_id"])
        console.log("____________________");
        console.log("sup");
        console.log(sup ? sup["name"] : "no Supplier");
        element.name = sup ? sup["name"] : "no Supplier";
        console.log("sup name");
        // console.log(sup[1]);
        // console.log(Object.entries(sup)[5][1].name);
        // console.log(Object.entries(sup)[5][1].name);
        // sup.name ? console.log(sup.name) : console.log("no name");
        // element.name = sup.name
        // console.log(element);
    }

    // console.log(countProducts)
    return countProducts

}


// // Get all categories
// async function getMapProducts() {

//     // Get all categories without virtual fields: 
//     // return CategoryModel.find().exec();

//     // Get all categories with virtual fields: 
//     // return CategoryModel.find().populate("products").exec();
//     return await ProductModel.find().populate("category").exec();

// }

async function getMapCategorys() {
    // Ignore virtual fields, except for default ones, such as 'id'
    // return await CategoryModel.find().exec();

    // Fill virtual field 'category' with the relevant model, in this case "CategoryModel"
    // return await CategoryModel.find().exec();
    const map = function () { emit(this.categoryId, this.price) };
    const reduce = function (categoryId, price) { return Math.max(price); };
    const max = await ProductModel.mapReduce(map, reduce, { out: "resultCollection1" });
    console.log("max")
    console.log(max)
    return await ProductModel.find().exec();
}

module.exports = {
    getOneCategory,
    addCategory,
    getAllCategorys,
    updateCategory,
    getCategorysByRange,
    getAggSupplierProducts,
    // getMapProducts,
    getMapCategorys,
    getAggProducts,
    getCategoryImage,
    deleteCategory,
    patchCategory,
    getAllProducts
}