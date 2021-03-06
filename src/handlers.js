/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';

import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import parseRss from './parseRss.js';

const validateInput = (value, existingUrls) => {
  const schema = yup.string().required().url().notOneOf(existingUrls);
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message;
  }
};

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
      // const newPosts = diffPosts.map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
      // state.posts = [...state.posts, ...newPosts];
      if (diffPosts.length !== 0) {
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

export const exampleHandler = (e, state) => {
  state.form.inputValue = e.target.textContent;
};

export const inputHandler = (e, state) => {
  state.form.inputValue = e.target.value;
};

export const submitHandler = (e, state) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const existingUrls = state.feeds.map((feed) => feed.url);
  const errorInput = validateInput(url, existingUrls);
  if (errorInput) {
    state.validateInputProcess = { valid: false, error: errorInput.key };
    return;
  }
  state.validateInputProcess = { valid: true, error: null };
  state.loadingProcess = { status: 'loading', error: null };

  axios.get(addProxyToUrl(url))
    .then((resp) => {
      const feedData = parseRss(resp.data.contents);
      const feedId = uniqueId();

      const feed = { ...feedData.feed, url, id: feedId };
      const posts = feedData.posts.map((post) => ({ ...post, id: uniqueId(), feedId }));

      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];
      state.loadingProcess = { status: 'loaded', error: null };

      const updateTimeout = 5000;
      setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      if (err.isAxiosError) {
        state.loadingProcess = { status: 'failed', error: 'network' };
      } else if (err.isParsingError) {
        state.loadingProcess = { status: 'failed', error: 'parsing' };
      } else {
        state.loadingProcess = { status: 'failed', error: 'unknown' };
      }
    });
};

export const postsHandler = (e, state) => {
  const id = e.target.dataset.postId;

  if (id) {
    state.ui.seenPosts.add(id);
  }

  if (e.target.dataset.bsTarget === '#modal') {
    state.modal = { postId: id };
  }
};
