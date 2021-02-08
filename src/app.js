import 'bootstrap/js/dist/modal.js';
import i18n from 'i18next';
import { setLocale } from 'yup';

import resources from './locales/index.js';
import view from './modules/view.js';

const app = () => {
  const defaultLanguage = 'en';
  const updateTimeout = 5000;

  const state = {
    lng: defaultLanguage,
    updateTimeout,
    form: {
      status: 'init',
      error: '',
    },
    feeds: [],
    posts: [],
    modal: { postId: '' },
  };

  setLocale({
    string: {
      url: 'notValidUrl',
    },
  });

  const i18nOptions = {
    lng: defaultLanguage,
    debug: false,
    resources,
  };

  i18n.init(i18nOptions).then(() => view(state));
};

export default app;
