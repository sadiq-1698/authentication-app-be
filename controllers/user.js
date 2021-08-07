const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const BCRYPT_SALT_ROUNDS = 12;

function sendResponse(res, statusCode, message, payload = null) {
  let resObject = {};
  resObject.statusCode = statusCode;
  resObject.message = message;
  if (payload) resObject.data = payload;
  res.send(resObject);
}

const allowedUserInfo = ["name", "email", "profilePhoto", "bio"];

exports.register_new_user = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await userModel.findOne({ email: email });

    if (userExists) return sendResponse(res, 409, "User already exists");

    const _password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = new userModel({
      email: email,
      password: _password
    });

    await user.save();

    return sendResponse(res, 200, "Registered successfully");
  } catch (error) {
    return sendResponse(res, 404, "An error occured. Try Again");
  }
};

exports.user_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await userModel.findOne({ email: email });

    if (!userExists) {
      return sendResponse(res, 404, "User does not exist");
    }

    let userInfo = {};

    for (let i = 0; i < allowedUserInfo.length; i++) {
      if (userExists[allowedUserInfo[i]]) {
        userInfo[allowedUserInfo[i]] = userExists[allowedUserInfo[i]];
      }
    }

    const isValidPassword = await bcrypt.compare(password, userExists.password);

    if (!isValidPassword) {
      return sendResponse(res, 403, "Incorrect email/password");
    }

    const jwtToken = jwt.sign({ id: userExists._id }, process.env.SECRET);

    return sendResponse(res, 200, "Login successful", {
      authToken: jwtToken,
      userInfo: userInfo
    });
  } catch (error) {
    return sendResponse(res, 404, "An error occured. Try Again");
  }
};
