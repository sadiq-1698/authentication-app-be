const messageModel = require("../models/message");

function sendResponse(res, statusCode, message, payload = null) {
  let resObject = {};
  resObject.statusCode = statusCode;
  resObject.message = message;
  if (payload) resObject.data = payload;
  res.send(resObject);
}

exports.create_message = async (req, res) => {
  const { conversationId, senderId, message } = req.body;

  const newMessage = new messageModel({
    conversationId: conversationId,
    senderId: senderId,
    text: message
  });

  try {
    if (req.user.id !== senderId) {
      return sendResponse(res, 401, "Unauthorized. Sending message failed");
    }

    await newMessage.save();

    return sendResponse(res, 200, "Message sent");
  } catch (error) {
    return sendResponse(res, 404, "An error occured. Try Again");
  }
};

exports.get_all_messages = async (req, res) => {
  try {
    const allMessages = await messageModel.find({
      conversationId: req.params.convoId
    });

    if (!allMessages) {
      return sendResponse(res, 403, "Failed fetching messages");
    }

    return sendResponse(res, 200, allMessages);
  } catch (error) {
    return sendResponse(res, 404, "An error occured. Try Again");
  }
};
