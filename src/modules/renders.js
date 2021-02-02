import i18n from 'i18next';

export const renderForm = (state, elements) => {
  const { feedback, button, input } = elements;
  const { form } = state;

  switch (form.status) {
    case 'loading':
      feedback.textContent = i18n.t(`feedback.${form.status}`);
      feedback.classList.add('text-success');
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      button.setAttribute('disabled', true);
      input.setAttribute('disabled', true);
      break;
    case 'loaded':
      input.value = '';
      feedback.textContent = i18n.t(`feedback.${form.status}`);
      button.removeAttribute('disabled');
      input.removeAttribute('disabled');
      break;
    case 'error1':
      feedback.textContent = i18n.t(`feedback.${form.error}`);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.removeAttribute('disabled');
      button.removeAttribute('disabled');
      break;
    case 'error2':
      feedback.textContent = form.error;
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      button.removeAttribute('disabled');
      input.removeAttribute('disabled');
      break;
    default:
      console.log('form.status', form.status);
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

export const renderFeeds = (state, elements) => {
  const { feedsCol } = elements;

  if (feedsCol.innerHTML === '') {
    const feedsTitle = document.createElement('h2');
    feedsTitle.textContent = 'Feeds';
    feedsCol.append(feedsTitle);
    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'mb-5');
    feedsCol.append(feedsList);
  }

  const feedsList = feedsCol.querySelector('ul');
  const feed = createFeedEl(state.newFeed);
  feedsList.prepend(feed);
};

const createPostEl = (feedPost) => {
  // eslint-disable-next-line object-curly-newline
  const { feedID, postID, postLink, postTitle } = feedPost;
  const post = document.createElement('li');
  post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
  post.setAttribute('data-feed-id', feedID);

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('target', '_blank');
  link.setAttribute('data-post-id', postID);
  link.href = postLink;
  link.textContent = postTitle;
  post.append(link);

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

export const renderPosts = (state, elements) => {
  const { postsCol } = elements;
  if (postsCol.innerHTML === '') {
    postsCol.innerHTML = '<h2>Posts</h2>';
    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'mb-5');
    postsCol.append(postsList);
  }
  const postsList = postsCol.querySelector('ul');
  state.newPosts.forEach((feedPost) => {
    const post = createPostEl(feedPost);
    postsList.prepend(post);
  });
};

export const renderReaded = (state, elements) => {
  const { postsCol } = elements;
  const readed = postsCol.querySelector(`[data-post-id="${state.readed}"]`);
  readed.classList.remove('fw-bold');
  readed.classList.add('fw-normal');
};
