import onChange from 'on-change';
import i18n from 'i18next';
// import { submitHandler, postsHandler, feedsHandler } from './handlers.js';

const renderForm = (state, elements) => {
  const { form } = state;
  const { feedback, addButton, input } = elements;

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
      addButton.disabled = true;
      break;
    case 'loaded':
      feedback.textContent = i18n.t(`feedback.${form.status}`);
      input.removeAttribute('readonly');
      addButton.disabled = false;
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
      input.removeAttribute('readonly');
      addButton.disabled = false;
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

const renderFeeds = (state, elements) => {
  const { feedsContainer } = elements;

  if (state.feeds.length) {
    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'mb-5');

    state.feeds.forEach((feed) => {
      feedsList.prepend(createFeedEl(feed));
    });

    feedsContainer.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = i18n.t('feeds.title');
    feedsContainer.append(title);
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
  button.textContent = i18n.t('buttons.preview');

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

const renderPosts = (state, elements) => {
  const { postsContainer } = elements;

  if (state.posts.length) {
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'mb-5');

    state.posts.forEach((post) => {
      postsList.prepend(createPostEl(post));
    });

    postsContainer.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = i18n.t('posts.title');
    postsContainer.append(title);
    postsContainer.append(postsList);
  } else {
    postsContainer.innerHTML = '';
  }
};

const renderModal = (state, elements) => {
  const { modalTitle, modalBody, modalFullArticle } = elements;

  const post = state.posts.find((i) => i.id === state.modal.postId);

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalFullArticle.href = post.link;
};

const view = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form':
        renderForm(watchedState, elements);
        break;
      case 'feeds':
        renderFeeds(watchedState, elements);
        break;
      case 'posts':
        renderPosts(watchedState, elements);
        break;
      case 'modal':
        renderModal(watchedState, elements);
        break;
      default:
        // console.log('unknown path:', path);
        // throw new Error('unknown path:', path);
    }
  });

  return watchedState;
};

export default view;
