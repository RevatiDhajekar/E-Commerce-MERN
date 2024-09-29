const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const errorMiddleware = require("./middleware/error");

//middleware to parse json
app.use(express.json());

//middleware to parse cookie
app.use(cookieParser());

//Route imports

app.use("/api/v1",require("./routes/productRoute"));
app.use("/api/v1",require("./routes/userRoutes"));
app.use("/api/v1",require("./routes/orderRoute"));

//middleware for errors
app.use(errorMiddleware);

module.exports = app;