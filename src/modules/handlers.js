/* eslint-disable no-param-reassign */
import axios from 'axios';

import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import parseRss from './parseRss.js';
import { addProxyToUrl, validateInput } from './utils.js';

const updateFeed = (feed, state) => {
  const proxyUrl = addProxyToUrl(feed.url);
  return axios.get(proxyUrl)
    .then((response) => {
      const { posts } = parseRss(response.data.contents);
      const diffPosts = differenceBy(posts, state.posts, 'title');
      if (diffPosts.length) {
        const newPosts = diffPosts.map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
        state.posts = [...state.posts, ...newPosts];
      }
    })
    .catch(noop);
};

const autoUpdateFeed = (feed, state, updateTimeout) => {
  updateFeed(feed, state)
    .then(() => {
      setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    });
};

export const submitHandler = (e, state) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const errorInput = validateInput(url, state);
  if (errorInput) {
    state.form = { status: 'error', error: errorInput };
    return;
  }

  state.form = { status: 'loading', error: '' };

  const urlWithProxy = addProxyToUrl(url);

  axios.get(urlWithProxy)
    .then((response) => {
      // console.log('response', response);
      const feedData = parseRss(response.data.contents);

      state.form = { status: 'loaded', error: '' };

      const feedId = uniqueId();

      const feed = { ...feedData.feed, url, id: feedId };
      const posts = feedData.posts.map((post) => ({ ...post, id: uniqueId(), feedId }));

      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];

      const updateTimeout = 5000;
      setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      if (err.isAxiosError) {
        state.form = { status: 'error', error: 'networkErr' };
      } else if (err.isParsingError) {
        state.form = { status: 'error', error: 'parsingErr' };
      } else {
        state.form = { status: 'error', error: err.message };
      }
    });
};

export const feedsHandler = (e, state) => {
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.dataset.feedId;
    const feed = state.feeds.find((i) => i.id === id);
    updateFeed(feed, state);
  }
};

export const postsHandler = (e, state) => {
  const id = e.target.dataset.postId;

  if (id) {
    state.posts.forEach((post) => {
      if (id === post.id) {
        post.readed = true;
      }
    });

    if (e.target.dataset.bsTarget === '#modal') {
      state.modal = { postId: id };
    }
  }
};
