import onChange from 'on-change';
import {
  renderForm,
  renderFeeds,
  renderPosts,
  renderReaded,
} from './renders.js';

const view = (state) => {
  const watchedState = onChange(state, (path) => {
    // console.log('path:', { path });
    switch (path) {
      case 'form':
        renderForm(state);
        break;
      case 'feeds':
      case 'newFeed':
        renderFeeds(state);
        break;
      case 'posts':
      case 'newPosts':
        renderPosts(state);
        break;
      case 'readed':
        renderReaded(state);
        break;
      default:
        throw new Error('unknown path:', path);
    }
  });

  return watchedState;
};

export default view;
