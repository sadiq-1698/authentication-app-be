const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    userModel
      .findOne({ _id: decoded.id })
      .then(currentUser => {
        if (currentUser != null) {
          req.user = decoded;
          next();
        } else {
          res.status(401).json({
            message: "Auth failed"
          });
        }
      })
      .catch(() => {
        res.status(401).json({
          message: "Auth failed"
        });
      });
  } catch (e) {
    res.status(401).json({
      message: "Auth failed"
    });
  }
};
