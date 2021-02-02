import onChange from 'on-change';
import {
  renderForm,
  renderFeeds,
  renderPosts,
  renderReaded,
} from './renders.js';

const view = (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    // console.log({ path, value });
    switch (path) {
      case 'form':
        renderForm(state, elements);
        break;
      case 'newFeed':
        renderFeeds(state, elements);
        break;
      case 'newPosts':
        renderPosts(state, elements);
        break;
      case 'readed':
        renderReaded(state, elements);
        break;
      default:
        console.log({ path, value });
    }
  });

  return watchedState;
};

export default view;
