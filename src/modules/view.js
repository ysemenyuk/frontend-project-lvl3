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
      case 'newFeed':
        renderFeeds(state);
        break;
      case 'newPosts':
        renderPosts(state);
        break;
      case 'readed':
        renderReaded(state);
        break;
      default:
        console.log('unknown path:', { path });
    }
  });

  return watchedState;
};

export default view;
