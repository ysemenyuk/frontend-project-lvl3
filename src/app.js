/* eslint-disable object-curly-newline */
import 'bootstrap/js/dist/modal.js';
import i18n from 'i18next';
import { setLocale } from 'yup';

import resources from './locales/index.js';
import view from './modules/view.js';
import { submitHandler, postsHandler, feedsHandler } from './modules/handlers.js';

const app = () => {
  const defaultLanguage = 'en';

  const state = {
    feeds: [],
    posts: [],
    loadingProcess: {
      status: 'idle',
      error: null,
    },
    form: {
      status: 'filling', // filling, loading, loaded, error
      error: null,
    },
    modal: {
      postId: null,
    },
    ui: {
      seenPosts: new Set(),
    },
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

      const { form, feedsContainer, postsContainer, input, example } = elements;

      form.addEventListener('submit', (e) => submitHandler(e, watched));
      feedsContainer.addEventListener('click', (e) => feedsHandler(e, watched));
      postsContainer.addEventListener('click', (e) => postsHandler(e, watched));

      example.addEventListener('click', (e) => {
        e.preventDefault();
        input.value = e.target.textContent;
      });
    });
};

export default app;
