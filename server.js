const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
connectDb();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(errorHandler);
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});