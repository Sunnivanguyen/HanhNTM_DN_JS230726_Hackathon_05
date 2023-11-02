const express = require("express");
const fs = require("fs");
const productValidation = require("../middleware/productValidation");
const router = express.Router();

const multer = require("multer");

const upload = multer();

const readProductFile = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile(
      `./dev-data/data/product.json`,
      "utf-8"
    );

    const dataJSON = JSON.parse(data);

    req.products = dataJSON;

    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

router.get("/", readProductFile, (req, res) => {
  const products = req.products;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

router.get("/:product_id", readProductFile, productValidation, (req, res) => {
  const products = req.products;

  const product = products.find(
    (product) => product.id === +req.params.product_id
  );

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

router.post("/", readProductFile, upload.none(), async (req, res) => {
  const products = req.products;

  console.log(products);

  const newProduct = {
    id: products[products.length - 1].id + 1,
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
  };

  products.push(newProduct);

  try {
    await fs.promises.writeFile(
      `./dev-data/data/product.json`,
      JSON.stringify(products)
    );

    return res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.put(
  "/:product_id",
  readProductFile,
  productValidation,
  upload.none(),
  async (req, res, next) => {
    const products = req.products;

    const updatedProducts = products.map((product) =>
      product.id === +req.params.product_id
        ? {
            ...product,
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
          }
        : product
    );

    try {
      await fs.promises.writeFile(
        `./dev-data/data/product.json`,
        JSON.stringify(updatedProducts)
      );
      res.status(201).json({
        status: "success",
        result: updatedProducts.length,
        data: {
          updatedProducts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:product_id",
  readProductFile,
  productValidation,
  async (req, res, next) => {
    const products = req.products;

    console.log(products);
    const updatedProducts = products.filter(
      (product) => product.id !== +req.params.product_id
    );
    try {
      await fs.promises.writeFile(
        `./dev-data/data/product.json`,
        JSON.stringify(updatedProducts)
      );
      res.status(201).json({
        status: "success",
        result: updatedProducts.length,
        data: {
          updatedProducts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
