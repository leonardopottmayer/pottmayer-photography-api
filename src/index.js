require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./util/database");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const postRoutes = require("./routes/postRoutes");
app.use("/posts", postRoutes);

const photoRoutes = require("./routes/photoRoutes");
app.use("/photos", photoRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log(`pottmayer-photography-api started on port ${port}`);
});
