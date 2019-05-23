import { parse } from 'date-fns';

import {
  UPDATE_WEATHER_CALLBACK,
  WEATHER_MINUTES_INTERVAL,
  WINDGURU_REFERER,
} from './constants';
import {
  answerCallbackQuery,
  sendLocation,
  sendMessage,
  sendWeather,
} from './telegram';
import { getWeather, isMinutesOld } from './utils';

let cachedWeather = null;

export const handleMessage = async message => {
  const { text } = message;
  if (text === '/start') {
    handleStart(message);
  } else if (text === '/clima') {
    handleWeather(message);
  } else if (text === '/windguru') {
    handleWindguru(message);
  } else if (text === '/spot') {
    handleSpot(message);
  } else {
    handleDefault(message);
  }
};

export const handleCallbackQuery = async query => {
  const { data, message } = query;
  let answer;
  try {
    if (data === UPDATE_WEATHER_CALLBACK) {
      await handleWeather(message, true);
      answer = 'Clima actualizado';
    }
  } catch {
    answer = 'Lo sentimos, ha ocurrido un error.';
  }
  return answerCallbackQuery(query, answer);
};

export const handleStart = message => {
  const { chat } = message;
  const text = 'Hola!, ¿querés ver el /clima actual?';
  return sendMessage(chat, text);
};

export const handleDefault = message => {
  const { chat } = message;
  const text = 'Lo siento, no te entiendo. ¿Querés ver el /clima actual?';
  return sendMessage(chat, text);
};

export const handleWeather = (message, editMessage = false) => {
  // Update weather only if it's WEATHER_MINUTES_INTERVAL minutes old
  if (cachedWeather) {
    const lastWeatherUpdate = parse(cachedWeather.datetime);
    if (!isMinutesOld(lastWeatherUpdate, WEATHER_MINUTES_INTERVAL)) {
      return sendWeather(message, cachedWeather, editMessage);
    }
  }

  return getWeather()
    .then(weather => {
      cachedWeather = weather;
    })
    .catch(() => {
      // Pass
    })
    .finally(() => {
      return sendWeather(message, cachedWeather, editMessage);
    });
};

export const handleWindguru = message => {
  const { chat } = message;
  const text = WINDGURU_REFERER.slice(8);
  return sendMessage(chat, text);
};

export const handleSpot = message => {
  const { chat } = message;
  const location = {
    latitude: -34.6563213,
    longitude: -61.0455684,
  };
  return sendLocation(chat, location);
};
