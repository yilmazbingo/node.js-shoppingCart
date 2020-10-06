const path = require("path");
const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);
// if we have this on top, we will never reach to another roude if it is "products/something", because express will read everything as params.id. "/something" will be treated as dynamic segment
router.get("/products/:productId", shopController.getProduct);

module.exports = router;
