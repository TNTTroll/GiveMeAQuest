const sendMessage = require("../../sendMessage");

exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);
  console.log(message);
  await sendMessage(message.chat.id, "I got your message!");
  return { statusCode: 200 };
};