/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';

import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import parseRss from './parseRss.js';

const addProxyToUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

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
    });
};

const autoUpdateFeed = (feed, state, updateTimeout) => {
  updateFeed(feed, state)
    .catch(noop)
    .finally(() => {
      setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    });
};

export const submitHandler = (e, state) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const existingUrls = state.feeds.map((feed) => feed.url);
  const schema = yup.string().url().notOneOf(existingUrls);

  schema.validate(url)
    .then(() => {
      state.form = { status: 'loading', error: '' };
      return axios.get(addProxyToUrl(url));
    })
    .then((resp) => {
      const feedData = parseRss(resp.data.contents);
      const feedId = uniqueId();

      const feed = { ...feedData.feed, url, id: feedId };
      const posts = feedData.posts.map((post) => ({ ...post, id: uniqueId(), feedId }));

      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];
      state.form = { status: 'loaded', error: '' };

      const updateTimeout = 5000;
      setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      if (err.isAxiosError) {
        state.form = { status: 'error', error: 'networkErr' };
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
  }

  if (e.target.dataset.bsTarget === '#modal') {
    state.modal = { postId: id };
  }
};
