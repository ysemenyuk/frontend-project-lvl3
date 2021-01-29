import onChange from 'on-change';

const statusMessage = {
  loading: 'Loading...',
  loaded: 'Rss has been loaded',
  existUrl: 'Rss already exists',
  notRss: 'This source doesnt contain valid rss',
  notValidUrl: 'Must be valid url',
};

const renderForm = (form, selectors) => {
  console.log('form.status', form.status);
  // console.log('selector', selector);
  const input = document.querySelector(selectors.input);
  const button = document.querySelector(selectors.button);
  const feedback = document.querySelector(selectors.feedback);

  feedback.innerHTML = '';
  feedback.textContent = statusMessage[form.status];

  if (form.valid) {
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
  } else {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  }

  if (form.status === 'error') {
    feedback.textContent = form.error;
  }

  if (form.status === 'loading') {
    button.setAttribute('disabled', true);
    input.setAttribute('disabled', true);
  } else {
    button.removeAttribute('disabled');
    input.removeAttribute('disabled');
  }
  if (form.status === 'loaded') {
    input.value = '';
    setTimeout(() => {
      feedback.innerHTML = '';
    }, 5000);
  }
};

const renderFeeds = (feeds, parentSelector) => {
  const feedsCol = document.querySelector(parentSelector);
  feedsCol.innerHTML = '';
  const feedsTitle = document.createElement('h2');
  feedsTitle.textContent = 'Feeds';
  feedsCol.append(feedsTitle);
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'mb-5');

  feeds.slice().reverse().forEach(({ feedTitle, feedDescription }) => {
    const feed = document.createElement('li');
    feed.classList.add('list-group-item');
    feed.innerHTML = `<h4>${feedTitle}</h4><p>${feedDescription}</p>`;
    feedsList.append(feed);
  });

  feedsCol.append(feedsList);
};

const createPost = ({ postLink, postTitle }) => {
  const post = document.createElement('li');
  post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('target', '_blank');
  link.href = postLink;
  link.textContent = postTitle;
  post.append(link);

  const button = document.createElement('button');
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.textContent = 'Preview';
  post.append(button);

  return post;
};

const renderPosts = (posts, parentSelector) => {
  const postsCol = document.querySelector(parentSelector);
  postsCol.innerHTML = '';
  postsCol.innerHTML = '<h2>Posts</h2>';

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'mb-5');

  posts.slice().reverse().forEach((feedPosts) => {
    feedPosts.forEach((feedPost) => {
      const post = createPost(feedPost);
      postsList.append(post);
    });
  });

  postsCol.append(postsList);
};

const view = (state, selectors) => {
  const watchedState = onChange(state, (path, value) => {
    console.log(1, { path, value });
    // console.log(2, state);
    switch (path) {
      case 'form':
        renderForm(state.form, selectors);
        break;
      case 'feeds':
        renderFeeds(state.feeds, selectors.feedsCol);
        break;
      case 'posts':
        renderPosts(state.posts, selectors.postsCol);
        break;
      default:
        console.log(2, { path, value });
    }
  });

  return watchedState;
};

export default view;
