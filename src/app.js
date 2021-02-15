import 'bootstrap/js/dist/modal.js';
import i18n from 'i18next';
import { setLocale } from 'yup';
// import yupLocale from './locales/yupLocale.js';
// import './locales/yupLocale.js';

import resources from './locales/index.js';
import view from './view.js';
import { exampleHandler, submitHandler, postsHandler } from './handlers.js';

const app = () => {
  const defaultLanguage = 'en';

  const state = {
    form: {
      valid: false,
      error: null,
    },
    loadingProcess: {
      status: 'idle', // loading, loaded, failed
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
    form: document.querySelector('form'),
    input: document.querySelector('[name="url"]'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    example: document.querySelector('#example'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFullArticle: document.querySelector('.full-article'),
  };

  setLocale({
    string: {
      url: 'inputUrlErr',
    },
    mixed: {
      notOneOf: 'existingUrlErr',
    },
  });

  const i18nOptions = {
    lng: defaultLanguage,
    debug: false,
    resources,
  };

  i18n.init(i18nOptions)
    .then(() => {
      const watched = view(state, elements);

      const { form, postsContainer, example } = elements;

      form.addEventListener('submit', (e) => submitHandler(e, watched));
      postsContainer.addEventListener('click', (e) => postsHandler(e, watched));
      example.addEventListener('click', (e) => exampleHandler(e, watched));
    });
};

export default app;
