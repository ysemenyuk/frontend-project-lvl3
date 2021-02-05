import * as yup from 'yup';
import { setLocale } from 'yup';

export const addProxy = (url) => {
  // const myURL = new URL('https://hexlet-allorigins.herokuapp.com');
  // myURL.pathname = '/get';
  // myURL.searchParams.append('url', url);
  // myURL.searchParams.append('disableCache', 'true');
  const proxyUrl = `https://hexlet-allorigins.herokuapp.com/get?url=${url}&disableCache=true`;
  // console.log('addProxy', proxyUrl);
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
  const existsUrls = existsFeeds.map((feed) => feed.feedUrl);
  if ((existsUrls).includes(url)) {
    return 'existUrl';
  }
  return null;
};
