/* eslint-disable no-param-reassign */
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import parse from './parse.js';
import {
  addProxy,
  validInput,
  validUrl,
  validResponse,
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
      const { feedPosts } = parse(response.data);
      const newPosts = getNewPosts(watched.allPosts, feedPosts);
      if (newPosts.length) {
        watched.allPosts = [...newPosts, ...watched.allPosts];
        watched.newPosts = [...newPosts];
      }
    })
    .catch((err) => {
      console.log('catch update:', err.message);
      // watched.form = { status: 'error', error: 'updateError' };
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
      // console.log('response.data', response.data);

      const notRss = validResponse(response.data);
      if (notRss) {
        watched.form = { status: 'error', error: notRss };
        return;
      }

      watched.form = { status: 'loaded', error: '' };

      const feedData = parse(response.data);
      // console.log(feedData);
      const feed = { ...feedData.feed, feedId: uniqueId() };
      const feedPosts = feedData.feedPosts.map((post) => ({ ...post, postId: uniqueId() }));

      watched.newFeed = feed;
      watched.allFeeds = [feed, ...watched.allFeeds];

      watched.newPosts = feedPosts;
      watched.allPosts = [...feedPosts, ...watched.allPosts];

      setTimeout(() => updateFeed(proxyUrl, watched, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      console.log('catch submit:', err.message);
      watched.form = { status: 'error', error: err.message };
    });
};

const makeModal = (id, posts) => {
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const fullArticle = modal.querySelector('.full-article');
  // console.log('makeModal posts:', posts);
  const post = posts.find(({ postId }) => postId === id);
  // console.log('makeModal post', post);
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
