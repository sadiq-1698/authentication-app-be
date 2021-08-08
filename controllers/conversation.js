const conversationModel = require("../models/conversation");

function sendResponse(res, statusCode, message, payload = null) {
  let resObject = {};
  resObject.statusCode = statusCode;
  resObject.message = message;
  if (payload) resObject.data = payload;
  res.send(resObject);
}

exports.new_conversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  const newConversation = new conversationModel({
    members: [senderId, receiverId]
  });

  try {
    const saveConversation = await newConversation.save();

    if (!saveConversation) {
      return sendResponse(res, 403, "Creating new conversation failed");
    }

    return sendResponse(res, 200, "New conversation created successfully");
  } catch (error) {
    return sendResponse(res, 404, "An error occured. Try Again");
  }
};

exports.my_conversations = async (req, res) => {
  try {
    const myConversations = await conversationModel.find({
      members: { $in: [req.user.id] }
    });

    if (!myConversations) {
      return sendResponse(res, 403, "Failed fetching conversations");
    }

    return sendResponse(res, 200, myConversations);
  } catch (error) {
    return sendResponse(res, 404, "An error occured. Try Again");
  }
};
