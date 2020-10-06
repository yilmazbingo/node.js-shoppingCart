const path = require("path");
// ROUTES ARE CONTROLLER

const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

// "/add-product" will be append to the current url
// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);
router.get("/edit-product/:productId", adminController.getEditProduct);

// in /edit/product/productId, updateProduct button will post everything here
router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
