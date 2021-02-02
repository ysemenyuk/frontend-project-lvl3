import onChange from 'on-change';
import { renderForm, renderFeeds, renderPosts } from './renders.js';

const view = (state, selectors) => {
  const watchedState = onChange(state, (path, value) => {
    console.log({ path, value });
    console.log(state);
    switch (path) {
      case 'form':
        renderForm(state, selectors);
        break;
      case 'feeds':
        renderFeeds(state, selectors.feedsCol);
        break;
      case 'posts':
        renderPosts(state, selectors.postsCol);
        break;
      default:
        console.log({ path, value });
    }
  });

  return watchedState;
};

export default view;
