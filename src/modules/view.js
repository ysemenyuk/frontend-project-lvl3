/* eslint-disable object-curly-newline */
import onChange from 'on-change';
import i18n from 'i18next';
import { submitHandler, postsHandler, feedsHandler } from './handlers.js';

export const renderForm = (state) => {
  const { form } = state;
  const feedback = document.querySelector('.feedback');
  const button = document.querySelector('[type="submit"]');
  const input = document.querySelector('[name="url"]');

  switch (form.status) {
    case 'init':
      feedback.textContent = '';
      feedback.classList.remove('text-success');
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      break;
    case 'loading':
      feedback.textContent = i18n.t(`feedback.${form.status}`);
      feedback.classList.add('text-success');
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      input.setAttribute('readonly', 'true');
      button.disabled = true;
      break;
    case 'loaded':
      feedback.textContent = i18n.t(`feedback.${form.status}`);
      input.removeAttribute('readonly', 'true');
      button.disabled = false;
      input.value = '';
      break;
    case 'error':
      if (i18n.exists(`feedback.${form.error}`)) {
        feedback.textContent = i18n.t(`feedback.${form.error}`);
      } else {
        feedback.textContent = form.error;
      }
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.removeAttribute('readonly', 'true');
      button.disabled = false;
      break;
    default:
      // console.log('unknown form status:', form.status);
      // throw new Error('unknown form status:', form.status);
  }
};

const createFeedEl = (feed) => {
  const feedEl = document.createElement('li');
  feedEl.classList.add('list-group-item');
  feedEl.setAttribute('data-feed-id', feed.id);
  feedEl.innerHTML = `<h4>${feed.title}</h4><p>${feed.description}</p>`;

  return feedEl;
};

export const renderFeeds = (state) => {
  const feedsContainer = document.querySelector('.feeds');

  if (state.feeds.length) {
    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'mb-5');

    state.feeds.forEach((feed) => {
      feedsList.prepend(createFeedEl(feed));
    });

    feedsContainer.innerHTML = '<h2>Feeds</h2>';
    feedsContainer.append(feedsList);
  } else {
    feedsContainer.innerHTML = '';
  }
};

const createPostTitle = (post) => {
  const title = document.createElement('a');
  if (post.readed) {
    title.classList.add('fw-normal', 'font-weight-normal');
  } else {
    title.classList.add('fw-bold', 'font-weight-bold');
  }
  title.setAttribute('target', '_blank');
  title.setAttribute('data-post-id', post.id);
  title.href = post.link;
  title.textContent = post.title;

  return title;
};

const createPreviewButton = (post) => {
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.setAttribute('data-post-id', post.id);
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Preview';

  return button;
};

const createPostEl = (post) => {
  const postEl = document.createElement('li');
  postEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

  const title = createPostTitle(post);
  const previewButton = createPreviewButton(post);

  postEl.append(title);
  postEl.append(previewButton);

  return postEl;
};

export const renderPosts = (state) => {
  const postsContainer = document.querySelector('.posts');

  if (state.posts.length) {
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'mb-5');

    state.posts.forEach((post) => {
      postsList.prepend(createPostEl(post));
    });

    postsContainer.innerHTML = '<h2>Posts</h2>';
    postsContainer.append(postsList);
  } else {
    postsContainer.innerHTML = '';
  }
};

export const renderModal = (state) => {
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const fullArticle = modal.querySelector('.full-article');

  const id = state.modal.postId;
  const post = state.posts.find((i) => i.id === id);

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  fullArticle.href = post.link;
};

const init = (state) => {
  const form = document.querySelector('form');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  form.addEventListener('submit', (e) => submitHandler(e, state));
  feedsContainer.addEventListener('click', (e) => feedsHandler(e, state));
  postsContainer.addEventListener('click', (e) => postsHandler(e, state));

  const input = document.querySelector('[name="url"]');
  const example = document.querySelector('#example');
  example.addEventListener('click', (e) => {
    e.preventDefault();
    input.value = e.target.textContent;
  });
};

const view = (state) => {
  const watchedState = onChange(state, (path) => {
    // console.log('onChange path:', { path });
    switch (path) {
      case 'form':
        renderForm(watchedState);
        break;
      case 'feeds':
        renderFeeds(watchedState);
        break;
      case 'posts':
        renderPosts(watchedState);
        break;
      case 'modal':
        renderModal(watchedState);
        break;
      default:
        // console.log('unknown path:', path);
        // throw new Error('unknown path:', path);
    }
  });

  init(watchedState);
};

export default view;
