import * as yup from 'yup';
import { setLocale } from 'yup';

export const addProxy = (url) => {
  // const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com');
  // proxyUrl.pathname = '/get';
  // proxyUrl.searchParams.append('url', url);
  // proxyUrl.searchParams.append('disableCache', 'true');
  const proxyUrl = `https://hexlet-allorigins.herokuapp.com/get?url=${url}&disableCache=true`;
  return proxyUrl;
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
  const existsUrls = existsFeeds.map((feed) => feed.url);
  if ((existsUrls).includes(url)) {
    return 'existUrl';
  }
  return null;
};
