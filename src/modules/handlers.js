/* eslint-disable no-param-reassign */
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import parseRss from './parseRss.js';
import {
  addProxy,
  validInput,
  validUrl,
} from './utils.js';

const getNewPosts = (existsPost, feedPosts) => {
  const [{ feedTitle }] = feedPosts;
  const existsTitles = existsPost
    .filter((post) => feedTitle === post.feedTitle)
    .map((post) => post.postTitle);

  const newPosts = feedPosts
    .filter((post) => !existsTitles.includes(post.postTitle))
    .map((post) => ({ ...post, postId: uniqueId() }));

  return newPosts;
};

const updateFeed = (url, watched, updateTimeout) => {
  axios.get(url)
    .then((response) => {
      const { feedPosts } = parseRss(response.data);
      const newPosts = getNewPosts(watched.allPosts, feedPosts);
      if (newPosts.length) {
        watched.allPosts = [...newPosts, ...watched.allPosts];
        watched.newPosts = [...newPosts];
      }
    })
    .catch((err) => {
      console.log('catch update:', err.message);
      // watched.form = { status: 'error', error: 'updateError' };
      // throw new Error(err.message);
    })
    .finally(() => {
      setTimeout(() => updateFeed(url, watched, updateTimeout), updateTimeout);
    });
};

export const submitHandler = (e, watched, updateTimeout) => {
  e.preventDefault();
  // console.log(e.target.elements);

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
      const feedData = parseRss(response.data);
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

      setTimeout(() => updateFeed(proxyUrl, watched, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      console.log('catch submit:', err.message);
      watched.form = { status: 'error', error: 'networkErr' };
      // throw new Error(err.message);
    });
};

const makeModal = (id, posts) => {
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const fullArticle = modal.querySelector('.full-article');
  const post = posts.find(({ postId }) => postId === id);
  const { postTitle, postDescription, postLink } = post;

  modalTitle.textContent = postTitle;
  modalBody.textContent = postDescription;
  fullArticle.href = postLink;
};

export const postsHandler = (e, watched) => {
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
    // console.log(e.target.getAttribute('data-post-id'));
    const id = e.target.getAttribute('data-post-id');
    // console.log(id);
    watched.readed = id;
    makeModal(id, watched.allPosts);
  }
};
