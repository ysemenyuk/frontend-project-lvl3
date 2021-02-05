import i18n from 'i18next';

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
      input.value = '';
      button.disabled = false;
      input.removeAttribute('readonly', 'true');
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
      button.disabled = false;
      input.removeAttribute('readonly', 'true');
      break;
    default:
      throw new Error('unknown form status:', form.status);
  }
};

const createFeedEl = (feedItem) => {
  const { feedId, feedTitle, feedDescription } = feedItem;
  const feed = document.createElement('li');
  feed.classList.add('list-group-item');
  feed.setAttribute('data-feed-id', feedId);
  feed.innerHTML = `<h4>${feedTitle}</h4><p>${feedDescription}</p>`;

  const updateButton = document.createElement('button');
  updateButton.classList.add('btn', 'btn-primary', 'btn-sm');
  updateButton.setAttribute('data-feed-id', feedId);
  updateButton.setAttribute('type', 'button');
  updateButton.textContent = 'Update feed';
  feed.append(updateButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-primary', 'btn-sm');
  deleteButton.setAttribute('data-feed-id', feedId);
  deleteButton.setAttribute('type', 'button');
  deleteButton.textContent = 'Delete feed';
  feed.append(deleteButton);

  return feed;
};

export const renderFeeds = (state) => {
  const feedsContainer = document.querySelector('.feeds');

  if (feedsContainer.innerHTML === '') {
    const feedsTitle = document.createElement('h2');
    feedsTitle.textContent = 'Feeds';
    feedsContainer.append(feedsTitle);
    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'mb-5');
    feedsContainer.append(feedsList);
  }

  const feedsList = feedsContainer.querySelector('ul');
  const feed = createFeedEl(state.newFeed);
  feedsList.prepend(feed);
};

const createPostEl = (feedPost) => {
  const {
    feedId,
    postId,
    postLink,
    postTitle,
  } = feedPost;

  const post = document.createElement('li');
  post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
  post.setAttribute('data-feed-id', feedId);

  const title = document.createElement('a');
  title.classList.add('fw-bold', 'font-weight-bold');
  title.setAttribute('target', '_blank');
  title.setAttribute('data-post-id', postId);
  title.href = postLink;
  title.textContent = postTitle;
  post.append(title);

  const previewButton = document.createElement('button');
  previewButton.classList.add('btn', 'btn-primary', 'btn-sm');
  previewButton.setAttribute('data-post-id', postId);
  previewButton.setAttribute('type', 'button');
  previewButton.setAttribute('data-bs-toggle', 'modal');
  previewButton.setAttribute('data-bs-target', '#modal');
  previewButton.textContent = 'Preview';
  post.append(previewButton);

  return post;
};

export const renderPosts = (state) => {
  const postsContainer = document.querySelector('.posts');

  if (postsContainer.innerHTML === '') {
    postsContainer.innerHTML = '<h2>Posts</h2>';
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'mb-5');
    postsContainer.append(postsList);
  }

  const postsList = postsContainer.querySelector('ul');
  state.newPosts.forEach((feedPost) => {
    const post = createPostEl(feedPost);
    postsList.prepend(post);
  });
};

export const renderReaded = (state) => {
  const postsContainer = document.querySelector('.posts');
  // console.log(state.readed);
  const postTitle = postsContainer.querySelector(`[data-post-id="${state.readed}"]`);

  // console.log(postTitle);
  postTitle.classList.remove('fw-bold');
  postTitle.classList.add('fw-normal');

  postTitle.classList.remove('font-weight-bold');
  postTitle.classList.add('font-weight-normal');
};

export const makeModal = (state) => {
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const fullArticle = modal.querySelector('.full-article');

  const id = state.readed;
  const post = state.allPosts.find(({ postId }) => postId === id);
  const { postTitle, postDescription, postLink } = post;

  modalTitle.textContent = postTitle;
  modalBody.textContent = postDescription;
  fullArticle.href = postLink;
};
