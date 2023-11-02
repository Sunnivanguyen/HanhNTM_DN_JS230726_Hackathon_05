module.exports = function productValidation(req, res, next) {
  const productId = req.params.product_id;
  const products = req.products;

  const product = products.find((product) => product.id === +productId);

  if (!product) {
    return res.status(404).json({
      status: "fail",
      message: "Product not found",
    });
  }

  next();
};
