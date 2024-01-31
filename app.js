const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://kasireddylaxmi66040:1234@cluster0.wrtaxpl.mongodb.net/NewsFeed",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const postRoutes = require("./routes/postRoutes");
const forgotRoutes = require("./routes/forgotRoutes");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", userRoutes); // Use the combined routes
app.use("/api", loginRoutes);
app.use("/api", postRoutes);
app.use("/api", forgotRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
