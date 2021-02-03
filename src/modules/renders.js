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
      button.disabled = true;
      input.disabled = true;
      break;
    case 'loaded':
      feedback.textContent = i18n.t(`feedback.${form.status}`);
      input.value = '';
      button.disabled = false;
      input.disabled = false;
      break;
    case 'error':
      feedback.textContent = i18n.t(`feedback.${form.error}`);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      button.disabled = false;
      input.disabled = false;
      break;
    default:
      console.log('unknown form status:', form.status);
  }
};

const createFeedEl = (feedItem) => {
  const { feedID, feedTitle, feedDescription } = feedItem;
  const feed = document.createElement('li');
  feed.classList.add('list-group-item');
  feed.setAttribute('data-feed-id', feedID);
  feed.innerHTML = `<h4>${feedTitle}</h4><p>${feedDescription}</p>`;
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
    feedID,
    postID,
    postLink,
    postTitle,
  } = feedPost;

  const post = document.createElement('li');
  post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
  post.setAttribute('data-feed-id', feedID);

  const title = document.createElement('a');
  title.classList.add('fw-bold');
  title.setAttribute('target', '_blank');
  title.setAttribute('data-post-id', postID);
  title.href = postLink;
  title.textContent = postTitle;
  post.append(title);

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.setAttribute('data-post-id', postID);
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Preview';
  post.append(button);

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
  const postTitle = postsContainer.querySelector(`[data-post-id="${state.readed}"]`);
  postTitle.classList.remove('fw-bold');
  postTitle.classList.add('fw-normal');
};
