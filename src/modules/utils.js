import * as yup from 'yup';

export const addProxyToUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

export const validateInput = (value, state) => {
  const existingUrls = state.feeds.map((feed) => feed.url);
  const schema = yup.string().url().notOneOf(existingUrls);
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message;
  }
};

// export const validateInput = (value) => {
//   const schema = yup.string().url();
//   try {
//     schema.validateSync(value);
//     return null;
//   } catch (err) {
//     return err.message;
//   }
// };

// export const validateUrl = (url, existingFeeds) => {
//   const existingUrls = existingFeeds.map((feed) => feed.url);
//   if ((existingUrls).includes(url)) {
//     return 'existingUrl';
//   }
//   return null;
// };
