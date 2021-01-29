// import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import * as yup from 'yup';

import view from './modules/view.js';
import parse from './modules/parse.js';

// const isExistUrl = (urls, url) => {
//   if (urls.includes(url)) {
//     return true;
//   }
//   return false;
// };

const validInput = (value) => {
  const schema = yup.string().url().required();

  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.message;
  }
};

// const valideData = (data) => {

// };

const app = () => {
  const state = {
    form: {
      status: 'ready',
      valid: true,
      error: '',
    },
    urls: [],
    feeds: [],
    posts: [],
  };

  const selectors = {
    form: 'form',
    input: '[name="url"]',
    button: '[type="submit"]',
    feedsCol: '.feeds',
    postsCol: '.posts',
    feedback: '.feedback',
  };

  const watched = view(state, selectors);

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(e.target);

    const formData = new FormData(e.target);
    const url = formData.get('url');
    // console.log(url);

    const error = validInput(url);
    if (error) {
      watched.form = { status: 'error', valid: false, error };
      return;
    }

    if ((state.urls).includes(url)) {
      watched.form = { status: 'existUrl', valid: false };
      return;
    }

    watched.form = { status: 'loading', valid: true };

    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
      .then((response) => {
        // console.log('response.data', response.data);
        if (!response.data.status.content_type.includes('rss')) {
          watched.form = { status: 'notRss', valid: false };
          return;
        }
        watched.form = { status: 'loaded', valid: true };
        watched.urls.push(url);
        const { feed, feedPosts } = parse(response.data.contents);
        watched.feeds.push(feed);
        watched.posts.push(feedPosts);
      })
      .catch((err) => {
        console.log('catch:', err.message);
        watched.form = { status: 'error', valid: false, error: err.message };
      });
  });
};

app();
