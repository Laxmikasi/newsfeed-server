const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config();



const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 6000;
// console.log(process.env.MONGODB_URI);
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const postRoutes = require("./routes/postRoutes");
const forgotRoutes = require("./routes/forgotRoutes");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoutes); 
app.use("/api", loginRoutes);
app.use("/api", postRoutes);
app.use("/api", forgotRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
