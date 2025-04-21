const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./connectDb/connectDb.js");
const propertyRoutes = require("./routes/propertyRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const PORT = process.env.PORT || 3000

app.use("/property", propertyRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });