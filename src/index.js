// import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
// import * as yup from 'yup';

import view from './modules/view.js';
import parse from './modules/parse.js';

const validate = (state, value) => {
  if (state.urls.includes(value)) {
    // feedback.textContent = statusMessage.exist;
    return 'existUrl';
  }
  return null;
  // const schema = yup
  //   .string()
  //   .trim()
  //   .required();

  // try {
  //   schema.validateSync(value);
  //   return null;
  // } catch (err) {
  //   return err.message;
  // }
};

// const valideData = (data) => {

// };

const app = () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    formStatus: '',
    errors: '',
    valid: '',
  };

  // const selectors = {
  //   form: 'form',
  //   feedsCol: '.feeds',
  //   postsCol: '.posts',
  //   feedback: '.feedback',
  // };

  const elements = {
    form: document.querySelector('form'),
    feedsCol: document.querySelector('.feeds'),
    postsCol: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
  };

  const watched = view(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(e.target);

    const formData = new FormData(e.target);
    const url = formData.get('url');
    // console.log(url);

    const valid = validate(state, url);
    if (valid) {
      watched.formStatus = valid;
      return;
    }
    watched.urls.push(url);
    watched.formStatus = 'loading';

    axios.get(url)
      .then((response) => {
        console.log('response.status', response.status);
        console.log('response.headers', response.headers);
        console.log('response.headers.content-type', response.headers['content-type']);
        if (!response.headers['content-type'].includes('rss')) {
          watched.formStatus = 'notRss';
          return;
        }

        watched.formStatus = 'loaded';
        const { feed, feedPosts } = parse(response.data);
        watched.feeds.push(feed);
        watched.posts.push(...feedPosts);
        // console.log(state);
      })
      .catch((err) => {
        console.log(4, err.message);
        watched.formStatus = 'error';
        watched.errorMessage = err.message;
      });
  });
};

app();
