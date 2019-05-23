const request = require("request-promise");
import { differenceInMinutes } from "date-fns";

import {
  WINDGURU_URL,
  WINDGURU_STATION_ID,
  WINDGURU_REFERER
} from "./constants";

export const isMinutesOld = (date, minutes) => {
  const now = new Date();
  const diff = differenceInMinutes(now, date);
  return diff > minutes;
};

export const getWeather = () => {
  const qs = {
    q: "station_data_current",
    id_station: WINDGURU_STATION_ID
  };
  const options = {
    headers: {
      referer: WINDGURU_REFERER
    }
  };
  return get(WINDGURU_URL, qs, options);
};

export const degreesToCardinal = d => {
  const dirs = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSO",
    "SO",
    "OSO",
    "O",
    "ONO",
    "NO",
    "NNO"
  ];

  const ix = Math.floor((d + 11.25) / 22.5);
  return dirs[ix % 16];
};

/** Request **/
export const get = (url, qs = {}, extraOptions = {}) => {
  const options = {
    ...extraOptions,
    url,
    qs,
    method: "GET",
    json: true
  };
  return request(url, options);
};

export const post = (url, body) => {
  const options = {
    url,
    body,
    method: "POST",
    json: true
  };
  return request(options);
};
