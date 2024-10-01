const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//get single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  // populate("user", "name email") is used to get the name and email fields from the User document associated with the user reference in the Order document.
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this id: ", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  console.log("myorders called.....")
  console.log("User Info:", req.user);  
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});




//get all orders -> Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach((order)=>{
    totalAmount+=order.totalPrice;
  });

  res.status(200).json({
    success:true,
    totalAmount,
    orders
  });
});


//update order status -> Admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);
  let totalAmount = 0;

 if(order.orderStatus==="Delievered"){
  return next(new ErrorHandler("You have already delievered this order",400));
 }

 order.orderItems.forEach( async order=>{
  await updateStock(order.product , order.quantity);
 });
 order.orderStatus = req.body.status;

 if(req.body.status === "Delievered"){
  order.delieveredAt = Date.now();
 }
 await order.save({
  validateBeforeSave:false
 });

  res.status(200).json({
    success:true,
  });
});

async function updateStock(productId , quantity){
  const product = await Product.findById(productId);

  if(product.stock != null){
      product.stock= product.stock - quantity;
  }

  product.save({validateBeforeSave:false});
}


//delete order ->Admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);

  if(!order){
  return next(new ErrorHandler("order not found with this id",400));
  }

  await order.deleteOne();
  res.status(200).json({
    success:true,
  });
})