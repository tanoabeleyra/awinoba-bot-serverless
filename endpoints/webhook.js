import { handleCallbackQuery, handleMessage } from '../handlers';

exports.handler = (event, context, callback) => {
  const update = JSON.parse(event.body); // Convert body to object
  if (update.message !== undefined) {
    handleMessage(update.message);
  } else if (update.callback_query != undefined) {
    handleCallbackQuery(update.callback_query);
  }
  callback(null, { statusCode: 200 }); // Tell Telegram that we received the update
};
