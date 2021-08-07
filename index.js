const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/user");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use("/user", userRoutes);
app.use("/conversation", conversationRoutes);
app.use("/message", messageRoutes);

app.get("/", function(_, res) {
  res.send("This application is live!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log("This application is live!");
});
