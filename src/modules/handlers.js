/* eslint-disable no-param-reassign */
import axios from 'axios';

import parse from './parse.js';
import {
  validInput,
  validUrl,
  validResponse,
  checkNewPosts,
} from './utils.js';

const updateFeed = (url, watched, updateInterval) => {
  axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const { feedPosts } = parse(response.data, watched);
      const newPosts = checkNewPosts(watched.posts, feedPosts);
      if (newPosts.length) {
        watched.posts = [...newPosts, ...watched.posts];
        watched.newPosts = [...newPosts];
      }
      setTimeout(() => updateFeed(url, watched, updateInterval), updateInterval);
    });
};

export const formHandler = (e, watched, updateInterval) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');

  const errorInput = validInput(url);
  if (errorInput) {
    watched.form = { status: 'error1', error: errorInput };
    return;
  }

  const errorUrl = validUrl(url, watched.feeds);
  if (errorUrl) {
    watched.form = { status: 'error1', error: errorUrl };
    return;
  }

  watched.form = { status: 'loading', error: '' };

  axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const errorRss = validResponse(response.data);
      if (errorRss) {
        watched.form = { status: 'error1', error: errorRss };
        return;
      }

      watched.form = { status: 'loaded', error: '' };
      const { feed, feedPosts } = parse(response.data, watched);
      watched.feeds = [feed, ...watched.feeds];
      watched.newFeed = feed;
      watched.posts = [...feedPosts, ...watched.posts];
      watched.newPosts = [...feedPosts];

      setTimeout(() => updateFeed(url, watched, updateInterval), updateInterval);
    })
    .catch((err) => {
      console.log('catch:', err.message);
      watched.form = { status: 'error2', error: err.message };
    });
};

export const postsHandler = (e, watched) => {
  // e.preventDefault();
  // console.dir(e.target);

  if (e.target.tagName === 'A') {
    const id = e.target.getAttribute('data-post-id');
    watched.readed = id;
  }
  if (e.target.tagName === 'BUTTON') {
    const id = e.target.getAttribute('data-post-id');
    watched.readed = id;

    const modal = document.querySelector('#modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const fullArticle = modal.querySelector('.full-article');

    const [post] = watched.posts.filter((i) => i.postID.toString() === id);
    const { postTitle, postDescription, postLink } = post;

    modalTitle.textContent = postTitle;
    modalBody.textContent = postDescription;
    fullArticle.href = postLink;
  }
};
