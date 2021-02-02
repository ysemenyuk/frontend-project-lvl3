// import axios from 'axios';
// import * as yup from 'yup';
// import { setLocale } from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';

import view from './modules/view.js';
import { formHandler, postsHandler } from './modules/handlers.js';
// import parse from './modules/parse.js';

// const validInput = (value) => {
//   setLocale({
//     mixed: {
//       required: 'requiredInput',
//     },
//     string: {
//       url: 'notValidUrl',
//     },
//   });

//   const schema = yup.string().url().required();

//   try {
//     schema.validateSync(value);
//     return null;
//   } catch (err) {
//     // console.log('err.message:', err.message);
//     return err.message;
//   }
// };

// const checkNewPosts = (existsPost, downloadedPosts) => {
//   const [{ feedTitle }] = downloadedPosts;
//   const existsTitles = existsPost
//     .filter((post) => feedTitle === post.feedTitle)
//     .map((post) => post.postTitle);

//   const newPosts = downloadedPosts.filter((post) => !existsTitles.includes(post.postTitle));
//   return newPosts;
// };

const app = () => {
  const defaultLanguage = 'en';
  i18n.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  });

  const state = {
    form: {
      status: '',
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

  const form = document.querySelector(selectors.form);
  const postsCol = document.querySelector(selectors.postsCol);

  form.addEventListener('submit', (e) => formHandler(e, watched));
  postsCol.addEventListener('click', (e) => postsHandler(e, watched));
};

export default app;
