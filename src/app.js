// import axios from 'axios';
// import * as yup from 'yup';
// import { setLocale } from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';

import view from './modules/view.js';
import { formHandler, postsHandler } from './modules/handlers.js';

const app = () => {
  const defaultLanguage = 'en';
  const updateIntervalForFeed = 5000;

  i18n.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  const state = {
    form: {
      status: 'init',
      error: '',
    },
    feeds: [],
    newFeed: '',
    posts: [],
    newPosts: [],
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('[name="url"]'),
    button: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsCol: document.querySelector('.feeds'),
    postsCol: document.querySelector('.posts'),
  };

  const watched = view(state, elements);

  elements.form.addEventListener('submit', (e) => formHandler(e, watched, updateIntervalForFeed));
  elements.postsCol.addEventListener('click', (e) => postsHandler(e, watched));
};

export default app;
