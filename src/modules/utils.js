import * as yup from 'yup';

export const addProxyToUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
  // const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com');
  // proxyUrl.pathname = '/get';
  // proxyUrl.searchParams.append('url', url);
  // proxyUrl.searchParams.append('disableCache', 'true');
  // const proxyUrl = `https://hexlet-allorigins.herokuapp.com/get?url=${url}&disableCache=true`;
  // return proxyUrl;
};

export const validateInput = (value) => {
  const schema = yup.string().url();
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message;
  }
};

export const validateUrl = (url, existingFeeds) => {
  const existingUrls = existingFeeds.map((feed) => feed.url);
  if ((existingUrls).includes(url)) {
    return 'existingUrl';
  }
  return null;
};
