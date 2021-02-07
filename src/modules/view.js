import onChange from 'on-change';
import {
  renderForm,
  renderFeeds,
  renderPosts,
  renderModal,
} from './renders.js';

const view = (state) => {
  const watchedState = onChange(state, (path) => {
    // console.log('onChange path:', { path });
    switch (path) {
      case 'form':
        renderForm(state);
        break;
      case 'feeds':
        renderFeeds(state);
        break;
      case 'posts':
        renderPosts(state);
        break;
      case 'modal':
        renderModal(state);
        break;
      default:
        // console.log('unknown path:', path);
        // throw new Error('unknown path:', path);
    }
  });

  return watchedState;
};

export default view;
