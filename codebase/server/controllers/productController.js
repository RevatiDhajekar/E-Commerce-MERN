const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//createProduct --Admin
exports.createProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user.id; //set in jwt token
  // Create the product using req.body directly (not as a function)
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all Products -> admin
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
    productCount,
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

//create new review or update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  ); //if loginid and existing review user id is equal

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        (rev.rating = rating);
         (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings =
     avg/ product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

//get All reviews of any product
exports.getProductReviews = catchAsyncErrors(async (req,res,next)=>{
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews:product.reviews
  });
});


//delete reviews
exports.deleteReview = catchAsyncErrors(async (req,res,next)=>{
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  //that reviews which not delete
  const reviews = product.reviews.filter(rev =>rev._id.toString() !== req.query.id.toString());
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = reviews.length === 0 ? 0 : avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(req.query.productId,
  {
    reviews,
    ratings,
    numOfReviews
  }, { new: true, runValidators: true })

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

