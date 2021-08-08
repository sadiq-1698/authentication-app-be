const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const BCRYPT_SALT_ROUNDS = 12;

function sendResponse(res, statusCode, message, payload = null) {
  let resObject = {};
  resObject.statusCode = statusCode;
  resObject.message = message;
  if (payload) resObject.data = payload;
  res.send(resObject);
}

const allowedUserInfo = ["name", "email", "profilePhoto", "bio", "phone"];

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

exports.edit_profile = async (req, res) => {
  try {
    const imagePath = await req?.files?.profilePhoto;
    const formBody = req.body;

    let secureImageURL = "";

    if (imagePath) {
      await cloudinary.uploader.upload(imagePath.tempFilePath, function(
        error,
        result
      ) {
        if (error) {
          return sendResponse(res, 404, "Failed updating profile data");
        }
        if (result) {
          secureImageURL = result.secure_url;
        }
      });
    }

    const userExists = await userModel.findOne({ _id: req.user.id });

    if (!userExists) {
      return sendResponse(res, 404, "User does not exist");
    }

    const _password = await bcrypt.hash(formBody.password, BCRYPT_SALT_ROUNDS);

    await userModel.findById(req.user.id, (err, updatedDetails) => {
      if (err) return sendResponse(res, 401, "Error updating details");

      Object.entries(formBody).forEach(([key, value]) => {
        updatedDetails[key] = value;
      });

      updatedDetails.profilePhoto = secureImageURL;
      updatedDetails.password = _password;
      updatedDetails.save();

      let userInfo = {};

      for (let i = 0; i < allowedUserInfo.length; i++) {
        if (updatedDetails[allowedUserInfo[i]]) {
          userInfo[allowedUserInfo[i]] = updatedDetails[allowedUserInfo[i]];
        }
      }

      return sendResponse(res, 200, "Profile updated successfully", {
        userInfo: userInfo
      });
    });
  } catch (error) {
    return sendResponse(res, 404, error);
  }
};
