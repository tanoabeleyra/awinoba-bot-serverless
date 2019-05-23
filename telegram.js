const errors = require('request-promise/errors');
import { format } from 'date-fns';

import { degreesToCardinal, post } from './utils';
import { BOT_URL, DATE_FORMAT, UPDATE_WEATHER_CALLBACK } from './constants';

export const sendMessage = (chat, text, extra = {}) => {
  const url = `${BOT_URL}/sendMessage`;
  const body = {
    ...extra,
    chat_id: chat.id,
    text,
  };
  return post(url, body);
};

export const editMessageText = (message, text, extra = {}) => {
  const url = `${BOT_URL}/editMessageText`;
  const { chat, message_id } = message;
  const body = {
    ...extra,
    chat_id: chat.id,
    message_id,
    text,
  };
  return post(url, body).catch(errors.StatusCodeError, error => {
    // A 400 error code is received when the message
    // text and the reply_markup didn't change.
    // Only rethrow error if it wasn't because of this.
    if (error.statusCode !== 400) {
      throw error;
    }
  });
};

export const answerCallbackQuery = (query, text) => {
  const url = `${BOT_URL}/answerCallbackQuery`;
  const body = {
    callback_query_id: query.id,
    text,
  };
  return post(url, body);
};

export const sendLocation = (chat, location) => {
  const url = `${BOT_URL}/sendLocation`;
  const body = {
    chat_id: chat.id,
    ...location,
  };
  return post(url, body);
};

export const sendWeather = (message, weather, editMessage) => {
  const {
    wind_avg,
    wind_max,
    wind_min,
    wind_direction,
    temperature,
    datetime,
  } = weather;

  const cardinal = degreesToCardinal(wind_direction);
  let text;
  text = `*Viento promedio:* ${wind_avg} nudos\n`;
  text += `*Viento máximo:* ${wind_max} nudos\n`;
  text += `*Viento mínimo:* ${wind_min} nudos\n`;
  text += `*Dirección:* ${cardinal} ${wind_direction}°\n`;
  text += `*Temperatura:* ${temperature} °C\n`;
  text += `\n_${format(datetime, DATE_FORMAT)}_`;

  const extra = {
    reply_markup: { inline_keyboard: updateWeatherButton },
    parse_mode: 'Markdown',
  };

  if (editMessage) {
    return editMessageText(message, text, extra);
  } else {
    return sendMessage(message.chat, text, extra);
  }
};

const updateWeatherButton = [
  [{ text: 'Actualizar', callback_data: UPDATE_WEATHER_CALLBACK }],
];
