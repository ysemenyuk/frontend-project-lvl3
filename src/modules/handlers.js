/* eslint-disable no-param-reassign */
import axios from 'axios';
import { uniqueId, noop, differenceBy } from 'lodash';
import parseRss from './parseRss.js';
import {
  addProxy,
  validInput,
  validUrl,
} from './utils.js';

// const getNewPosts = (existsPost, feedPosts) => {
//   const [{ feedTitle }] = feedPosts;
//   const existsTitles = existsPost
//     .filter((post) => feedTitle === post.feedTitle)
//     .map((post) => post.postTitle);

//   const newPosts = feedPosts
//     .filter((post) => !existsTitles.includes(post.postTitle))
//     .map((post) => ({ ...post, postId: uniqueId() }));

//   return newPosts;
// };

const getNewPosts = (existsPost, feedPosts) => {
  const newPosts = differenceBy(feedPosts, existsPost, 'postTitle');
  // console.log('newPosts', newPosts);
  return newPosts.map((post) => ({ ...post, postId: uniqueId() }));
};

const updateFeed = (url, watched) => {
  const proxyUrl = addProxy(url);
  return axios.get(proxyUrl)
    .then((response) => {
      const { feedPosts } = parseRss(response.data.contents);
      const newPosts = getNewPosts(watched.allPosts, feedPosts);
      if (newPosts.length) {
        watched.allPosts = [...newPosts, ...watched.allPosts];
        watched.newPosts = [...newPosts];
      }
    })
    .catch(() => {
      noop();
    });
};

const autoUpdateFeed = (url, watched, updateTimeout) => {
  updateFeed(url, watched)
    .then(() => {
      setTimeout(() => autoUpdateFeed(url, watched, updateTimeout), updateTimeout);
    });
};

export const submitHandler = (e, watched, updateTimeout) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const errorInput = validInput(url);
  if (errorInput) {
    watched.form = { status: 'error', error: errorInput };
    return;
  }

  const existUrl = validUrl(url, watched.allFeeds);
  if (existUrl) {
    watched.form = { status: 'error', error: existUrl };
    return;
  }

  watched.form = { status: 'loading', error: '' };

  const proxyUrl = addProxy(url);

  axios.get(proxyUrl)
    .then((response) => {
      // console.log('response', response);
      const feedData = parseRss(response.data.contents);
      if (!feedData) {
        watched.form = { status: 'error', error: 'notRss' };
        return;
      }

      watched.form = { status: 'loaded', error: '' };

      const feed = { ...feedData.feed, feedUrl: url, feedId: uniqueId() };
      const feedPosts = feedData.feedPosts.map((post) => ({ ...post, postId: uniqueId() }));

      watched.newFeed = feed;
      watched.allFeeds = [feed, ...watched.allFeeds];

      watched.newPosts = feedPosts;
      watched.allPosts = [...feedPosts, ...watched.allPosts];

      setTimeout(() => autoUpdateFeed(url, watched, updateTimeout), updateTimeout);
    })
    .catch(() => {
      // console.log('catch submit:', err.message);
      watched.form = { status: 'error', error: 'networkErr' };
    });
};

export const feedsHandler = (e, watched) => {
  // console.dir(e.target);
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.getAttribute('data-feed-id');
    const feed = watched.allFeeds.find(({ feedId }) => feedId === id);
    const { feedUrl } = feed;
    updateFeed(feedUrl, watched);
  }
};

export const postsHandler = (e, watched) => {
  // console.dir(e.target);
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
    watched.readed = e.target.getAttribute('data-post-id');
  }
};
