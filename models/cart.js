const fs = require("fs");
const path = require("path");

// require.main.filename points to the app.js in root
const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  // since i need to delete cart items inside Product model, having static methods makes it easier
  static addProduct(id, productPrice) {
    //   fs reads file as buffers. we need to parse it
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        // this will create a new array. so we wont mutate our original array
        // we could use a different name
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      //   product.price is posted as string. if we do not convert it to number, it will concatenate
      // +productPrice converts price from string to number
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      // if product is not in the card, it will have no qty and app will crash.
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id === id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * productQty;
      fs.writeFile(
        p,
        JSON.stringify(updatedCart, (err) => {
          if (err) {
            console.log(err);
          }
        })
      );
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
};
