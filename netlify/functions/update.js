/*exports.handler = async (event) => {
  console.log("Received an update from Telegram!", event.body);
  return { statusCode: 200 };
};
*/

const axios = require("axios").default;

module.exports = async (chat_id, text) => {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id,
        text,
    });

    return true;
};