/* eslint-disable no-param-reassign */
import axios from 'axios';
import * as yup from 'yup';
import { setLocale } from 'yup';

import parse from './parse.js';

const validInput = (value) => {
  setLocale({
    mixed: {
      required: 'requiredInput',
    },
    string: {
      url: 'notValidUrl',
    },
  });

  const schema = yup.string().url().required();

  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    // console.log('err.message:', err.message);
    return err.message;
  }
};

export const postsHandler = (e, watched) => {
  // e.preventDefault();
  console.dir(e.target);
  if (e.target.tagName === 'BUTTON') {
    const modal = document.querySelector('#modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const fullArticle = modal.querySelector('.full-article');
    const id = e.target.getAttribute('data-post-id');
    const [post] = watched.posts.filter((i) => i.postID.toString() === id);
    const { postTitle, postDescription, postLink } = post;

    modalTitle.textContent = postTitle;
    modalBody.textContent = postDescription;
    fullArticle.href = postLink;
  }
};

export const formHandler = (e, watched) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const url = formData.get('url');

  const error = validInput(url);
  if (error) {
    watched.form = { status: 'error', error };
    return;
  }

  if ((watched.urls).includes(url)) {
    watched.form = { status: 'error', error: 'existUrl' };
    return;
  }

  watched.form = { status: 'loading', error: '' };

  axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      console.log('response.data', response.data);
      if (!response.data.status.content_type.includes('rss')) {
        watched.form = { status: 'error', error: 'notRss' };
        return;
      }
      watched.form = { status: 'loaded', error: '' };
      const { feed, feedPosts } = parse(response.data.contents, watched);
      watched.urls = [url, ...watched.urls];
      watched.feeds = [feed, ...watched.feeds];
      watched.posts = [...feedPosts, ...watched.posts];
    })
    // .then(() => {
    //   setInterval(() => {
    //     axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    //       .then((response) => {
    //         // console.log(state.posts);
    //         const { feedPosts } = parse(response.data.contents, state);
    //         const newPosts = checkNewPosts(state.posts, feedPosts);
    //         // console.log(newPosts);
    //         watched.posts = [...newPosts, ...state.posts];
    //       });
    //   }, 5000);
    // })
    .catch((err) => {
      console.log('catch:', err.message);
      watched.form = { status: 'error', error: 'networkError' };
    });
};
