import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import * as yup from 'yup';
import { setLocale } from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';

import view from './modules/view.js';
import parse from './modules/parse.js';

function validInput(value) {
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
}

const checkNewPosts = (existsPost, downloadedPosts) => {
  const [{ feedTitle }] = downloadedPosts;
  const existsTitles = existsPost
    .filter((post) => feedTitle === post.feedTitle)
    .map((post) => post.postTitle);

  const newPosts = downloadedPosts.filter((post) => !existsTitles.includes(post.postTitle));
  return newPosts;
};

const app = () => {
  const defaultLanguage = 'en';
  i18n.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  const state = {
    form: {
      status: 'ready',
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
      watched.form = { status: 'error', error };
      return;
    }

    if ((state.urls).includes(url)) {
      watched.form = { status: 'error', error: 'existUrl' };
      return;
    }

    watched.form = { status: 'loading', error: '' };

    axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
      .then((response) => {
        // console.log('response.data', response.data);
        if (!response.data.status.content_type.includes('rss')) {
          watched.form = { status: 'error', error: 'notRss' };
          return;
        }
        watched.form = { status: 'loaded', error: '' };
        const { feed, feedPosts } = parse(response.data.contents, state);
        watched.urls = [url, ...state.urls];
        watched.feeds = [feed, ...state.feeds];
        watched.posts = [...feedPosts, ...state.posts];
      })
      .then(() => {
        setInterval(() => {
          axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
            .then((response) => {
              // console.log(state.posts);
              const { feedPosts } = parse(response.data.contents, state);
              const newPosts = checkNewPosts(state.posts, feedPosts);
              // console.log(newPosts);
              watched.posts = [...newPosts, ...state.posts];
            });
        }, 5000);
      })
      .then(() => {
        const btns = document.querySelectorAll('button');
        console.log(btns);
      })
      .catch((err) => {
        console.log('catch:', err.message);
        watched.form = { status: 'error', error: 'networkError' };
      });
  });
};

app();
