import i18n from 'i18next';
import resources from './locales/index.js';

import view from './modules/view.js';
import { submitHandler, postsHandler } from './modules/handlers.js';

const app = () => {
  const defaultLanguage = 'en';
  const updateTimeout = 5000;

  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const state = {
    form: {
      status: 'init',
      error: '',
    },
    allFeeds: [],
    newFeed: '',
    allPosts: [],
    newPosts: [],
  };

  const watched = view(state);

  const form = document.querySelector('form');
  const postsContainer = document.querySelector('.posts');

  form.addEventListener('submit', (e) => submitHandler(e, watched, updateTimeout));
  postsContainer.addEventListener('click', (e) => postsHandler(e, watched));
};

export default app;
