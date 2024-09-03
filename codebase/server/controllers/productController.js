const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//createProduct --Admin
exports.createProduct = catchAsyncErrors(async (req, res) => {
  console.log("create product call");
  // Create the product using req.body directly (not as a function)
  const product = await Product.create(req.body);

  // Send a success response
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultsPerPage = 2;
  const productCount = await Product.countDocuments();
  console.log("req.query=> ", req.query);

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount
  });
});

//Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.deleteOne();
  return res.status(200).json({
    success: true,
    message: "product deleted succesfully.",
  });
});
