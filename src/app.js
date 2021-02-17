import 'bootstrap/js/dist/modal.js';
import i18n from 'i18next';
import { setLocale } from 'yup';

import yupLocale from './locales/yupLocale.js';
import resources from './locales/index.js';
import view from './view.js';
import { exampleHandler, submitHandler, postsHandler } from './handlers.js';

const app = () => {
  const defaultLanguage = 'ru';

  const state = {
    form: {
      status: null,
    },
    validateInputProcess: {
      valid: false,
      error: null,
    },
    loadingProcess: {
      status: 'idle',
      error: null,
    },
    feeds: [],
    posts: [],
    modal: {
      postId: null,
    },
    ui: {
      seenPosts: new Set(),
    },
    example: null,
  };

  const elements = {
    title: document.querySelector('h1'),
    description: document.querySelector('.lead'),
    example: document.querySelector('.text-muted > span'),
    exampleLink: document.querySelector('#exampleLink'),
    form: document.querySelector('form'),
    input: document.querySelector('[name="url"]'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
  };

  setLocale(yupLocale);

  const i18nOptions = {
    lng: defaultLanguage,
    debug: false,
    resources,
  };

  return i18n.init(i18nOptions)
    .then(() => {
      const watched = view(state, elements);
      watched.form = { status: 'init' };

      const { form, postsContainer, exampleLink } = elements;

      form.addEventListener('submit', (e) => submitHandler(e, watched));
      exampleLink.addEventListener('click', (e) => exampleHandler(e, watched));
      postsContainer.addEventListener('click', (e) => postsHandler(e, watched));
    });
};

export default app;
