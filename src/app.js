import 'bootstrap/js/dist/modal.js';
import i18n from 'i18next';
import { setLocale } from 'yup';

import resources from './locales/index.js';
import { view, init } from './modules/view.js';

const app = () => {
  const defaultLanguage = 'en';

  const state = {
    form: {
      status: 'init',
      error: '',
    },
    feeds: [],
    posts: [],
    modal: {
      postId: '',
    },
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
      const watched = view(state);
      init(watched);
    });
};

export default app;
