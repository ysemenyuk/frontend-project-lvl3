/* eslint-disable no-param-reassign */
import axios from 'axios';

import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import parseRss from './parseRss.js';
import {
  addProxy,
  validInput,
  validUrl,
} from './utils.js';

const updateFeed = (feed, watched) => {
  const proxyUrl = addProxy(feed.url);
  return axios.get(proxyUrl)
    .then((response) => {
      const { posts } = parseRss(response.data.contents);
      const diffPosts = differenceBy(posts, watched.posts, 'title');
      if (diffPosts.length) {
        const newPosts = diffPosts.map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
        watched.posts = [...watched.posts, ...newPosts];
      }
    })
    .catch(() => {
      noop();
    });
};

const autoUpdateFeed = (feed, watched, updateTimeout) => {
  updateFeed(feed, watched)
    .then(() => {
      setTimeout(() => autoUpdateFeed(feed, watched, updateTimeout), updateTimeout);
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

  const existUrl = validUrl(url, watched.feeds);
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

      const feedId = uniqueId();

      const feed = { ...feedData.feed, url, id: feedId };
      const posts = feedData.posts.map((post) => ({ ...post, id: uniqueId(), feedId }));

      watched.feeds = [...watched.feeds, feed];
      watched.posts = [...watched.posts, ...posts];

      setTimeout(() => autoUpdateFeed(feed, watched, updateTimeout), updateTimeout);
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
    const feed = watched.feeds.find(({ feedId }) => feedId === id);
    const { feedUrl } = feed;
    updateFeed(feedUrl, watched);
  }
};

export const postsHandler = (e, watched) => {
  // console.dir(e.target);
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
    const id = e.target.getAttribute('data-post-id');

    watched.posts.forEach((post) => {
      if (id === post.id) {
        post.readed = true;
      }
    });

    if (e.target.tagName === 'BUTTON') {
      watched.modal = id;
    }
  }
};
