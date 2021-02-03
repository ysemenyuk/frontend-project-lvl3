import * as yup from 'yup';
import { setLocale } from 'yup';
import axios from 'axios';

export const getFeed = (url) => {
  const newUrl = encodeURIComponent(url);
  return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${newUrl}&disableCache=true`);
};

export const validInput = (value) => {
  setLocale({
    string: {
      url: 'notValidUrl',
    },
  });

  const schema = yup.string().url();

  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message;
  }
};

export const validUrl = (url, existsFeeds) => {
  const existsUrls = existsFeeds.map((item) => item.feedLink);
  if ((existsUrls).includes(url)) {
    return 'existUrl';
  }
  return null;
};

export const validResponse = (data) => {
  if (!data.status.content_type.includes('rss')) {
    return 'notRss';
  }
  return null;
};
