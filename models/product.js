const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

// ----------process.mainModule.filename is deprecated
// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "products.json");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

// since this an async, if we do not return cb, when we run this file inside fetchAll, it would return an empty array.
// async code always returns cb with holding the data. that waf function will not return undefined right away, it will wait for the cb to fisnied executing
// CALLBACK means wait for running code, once it successfully finished running, pass the returned value to the callback
// ASYNC code has to be either written in callback or promise.
// So getProductsFromFile does not need any argument to run the operation. once it is done with its operation, it passes the return value to the callback
const getProductsFromFile = (cb) => {
  // this async reads and saves it to the memory first. we could do by stream for bigger files
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      // read file returns string. inorder to get it as an array we need to parse it
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // i wrote the logic when I defined the function. so producst will be either [] or a full array
    getProductsFromFile((products) => {
      // if id exist means we are positng from editing form
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        // when we post the values in thr form, it creates a new product which is "this"
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();

        // "this" refers to the object that created in the class
        // using arrow function "this" will not change its context
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.findIndex((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      // some() returns boolean
      const product = products.find((p) => p.id === id);
      // we did an operation and then immediately passed the result to callback
      cb(product);
    });
  }
};
