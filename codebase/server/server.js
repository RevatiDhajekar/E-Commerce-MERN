const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")
// Config
const result = dotenv.config({ path: "./config/config.env" }); 

//connect to DB
connectDatabase();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});
