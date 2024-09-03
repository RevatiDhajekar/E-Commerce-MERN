const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//Hnadling uncaught exception
process.on("uncaughtException",(err)=>{
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
})

// Config
const result = dotenv.config({ path: "./config/config.env" }); 

//connect to DB
connectDatabase();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});


//unhandled promise rejection
process.on("unhandledRejection", (err) =>{
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection");
  //gracefully shut down the server
  server.close(()=>{
    process.exit(1);  //exit with failure code
  });
})