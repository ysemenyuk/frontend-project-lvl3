/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';

import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import differenceBy from 'lodash/differenceBy';

import parseRss from './parseRss.js';

const validateInput = (value, state) => {
  const existingUrls = state.feeds.map((feed) => feed.url);
  const schema = yup.string().url().notOneOf(existingUrls);
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
      if (diffPosts.length) {
        const newPosts = diffPosts.map((post) => ({ ...post, id: uniqueId(), feedId: feed.id }));
        state.posts = [...state.posts, ...newPosts];
      }
    })
    .catch(noop);
};

const autoUpdateFeed = (feed, state, updateTimeout) => {
  updateFeed(feed, state).then(() => {
    setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
  });
};

export const submitHandler = (e, state) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const errorInput = validateInput(url, state);
  if (errorInput) {
    state.form.processState = 'failed';
    state.form.feedback = errorInput;
    return;
  }
  // state.form = { valid: true, error: null };
  state.form.processState = 'loading';
  state.form.feedback = 'loading';

  axios.get(addProxyToUrl(url))
    .then((resp) => {
      const feedData = parseRss(resp.data.contents);
      const feedId = uniqueId();

      const feed = { ...feedData.feed, url, id: feedId };
      const posts = feedData.posts.map((post) => ({ ...post, id: uniqueId(), feedId }));

      state.feeds = [...state.feeds, feed];
      state.posts = [...state.posts, ...posts];
      state.form.processState = 'loaded';
      state.form.feedback = 'loaded';

      const updateTimeout = 5000;
      setTimeout(() => autoUpdateFeed(feed, state, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      state.form.processState = 'failed';
      if (err.isAxiosError) {
        state.form.feedback = 'networkErr';
      } else if (err.isParsingError) {
        state.form.feedback = 'parsingErr';
      } else {
        state.form.feedback = 'unknownErr';
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
    state.ui.seenPosts.add(id);
  }

  if (e.target.dataset.bsTarget === '#modal') {
    state.modal = { postId: id };
  }
};
