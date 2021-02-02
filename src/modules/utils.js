import * as yup from 'yup';
import { setLocale } from 'yup';

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

export const checkNewPosts = (existsPost, downloadedPosts) => {
  const [{ feedTitle }] = downloadedPosts;
  const existsTitles = existsPost
    .filter((post) => feedTitle === post.feedTitle)
    .map((post) => post.postTitle);

  const newPosts = downloadedPosts.filter((post) => !existsTitles.includes(post.postTitle));
  return newPosts;
};
