import onChange from 'on-change';

const statusMessage = {
  error: 'Network error',
  loading: 'Loading...',
  loaded: 'Rss has been loaded',
  existUrl: 'Rss already exists',
  notRss: 'This source doesnt contain valid rss',
  notValidUrl: 'Must be valid url',
};

// const state = {
//   urls: [],
//   feeds: [],
//   posts: [],
//   formStatus: '',
//   errorMessage: '',
//   valid: '',
// };

// const elements = {
//   form: document.querySelector('form'),
//   feedsCol: document.querySelector('.feeds'),
//   postsCol: document.querySelector('.posts'),
//   feedback: document.querySelector('.feedback'),
// };

const renderStatus = (state, elements) => {
  console.log('status', state.formStatus);

  switch (state.formStatus) {
    case 'existUrl':
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = statusMessage.existUrl;
      break;
    case 'notRss':
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = statusMessage.notRss;
      break;
    case 'loading':
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = statusMessage.loading;
      break;
    case 'loaded':
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = statusMessage.loaded;
      break;
    case 'error':
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = state.errorMessage;
      break;
    default:
      console.log('Unknown status', state.formStatus);
  }
};

const renderFeeds = (state, elements) => {
  // eslint-disable-next-line no-param-reassign
  elements.feedsCol.innerHTML = '';
  const feedsTitle = document.createElement('h2');
  feedsTitle.textContent = 'Feeds';
  elements.feedsCol.append(feedsTitle);
  const feeds = document.createElement('ul');

  state.feeds.forEach(({ feedTitle, feedDescription }) => {
    const feed = document.createElement('li');
    feed.innerHTML = `<h3>${feedTitle}</h3><p>${feedDescription}</p>`;
    feeds.append(feed);
  });

  elements.feedsCol.append(feeds);
};

const renderPosts = (state, elements) => {
  // eslint-disable-next-line no-param-reassign
  elements.postsCol.innerHTML = '';
  const postsTitle = document.createElement('h2');
  postsTitle.textContent = 'Posts';
  elements.postsCol.append(postsTitle);
  const posts = document.createElement('ul');

  state.posts.forEach(({ postTitle, postLink }) => {
    const post = document.createElement('li');
    post.innerHTML = `<a href="${postLink}">${postTitle}</a>`;
    posts.append(post);
  });

  elements.postsCol.append(posts);
};

const view = (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    console.log(1, path, value);
    console.log(2, state);
    renderStatus(state, elements);
    renderFeeds(state, elements);
    renderPosts(state, elements);
  });

  return watchedState;
};

export default view;
