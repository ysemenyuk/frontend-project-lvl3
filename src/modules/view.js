import onChange from 'on-change';
import i18n from 'i18next';

// const statusMessage = {
//   loading: 'Loading...',
//   loaded: 'Rss has been loaded',
//   existUrl: 'Rss already exists',
//   notRss: 'This source doesnt contain valid rss',
//   notValidUrl: 'Must be valid url',
// };

const renderForm = (form, selectors) => {
  // console.log('form.status', form.status);
  const input = document.querySelector(selectors.input);
  const button = document.querySelector(selectors.button);
  const feedback = document.querySelector(selectors.feedback);

  if (form.status === 'error') {
    feedback.textContent = i18n.t(`feedback.${form.error}`);
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
  } else {
    feedback.textContent = i18n.t(`feedback.${form.status}`);
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    input.classList.remove('is-invalid');
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
    }, 10000);
  }
};

const renderFeeds = (state, parentSelector) => {
  const feedsCol = document.querySelector(parentSelector);
  feedsCol.innerHTML = '';
  const feedsTitle = document.createElement('h2');
  feedsTitle.textContent = 'Feeds';
  feedsCol.append(feedsTitle);
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'mb-5');

  state.feeds.forEach(({ feedID, feedTitle, feedDescription }) => {
    const feed = document.createElement('li');
    feed.classList.add('list-group-item');
    feed.setAttribute('data-feed-id', feedID);
    feed.innerHTML = `<h4>${feedTitle}</h4><p>${feedDescription}</p>`;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.setAttribute('data-feed-id', feedID);
    button.textContent = 'Delete this feed';
    feed.append(button);

    feedsList.append(feed);
  });

  feedsCol.append(feedsList);
};

// eslint-disable-next-line object-curly-newline
const createPost = ({ feedID, postID, postLink, postTitle }) => {
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
  button.textContent = 'Preview';
  post.append(button);

  return post;
};

const renderPosts = (state, parentSelector) => {
  const postsCol = document.querySelector(parentSelector);
  postsCol.innerHTML = '';
  postsCol.innerHTML = '<h2>Posts</h2>';

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'mb-5');

  state.posts.forEach((feedPost) => {
    const post = createPost(feedPost);
    postsList.append(post);
  });

  postsCol.append(postsList);
};

const view = (state, selectors) => {
  const watchedState = onChange(state, (path, value) => {
    // console.log({ path, value });
    // console.log(state);
    switch (path) {
      case 'form':
        renderForm(state.form, selectors);
        break;
      case 'feeds':
        renderFeeds(state, selectors.feedsCol);
        break;
      case 'posts':
        renderPosts(state, selectors.postsCol);
        break;
      // case 'urls':
      //   updatePosts(state, selectors);
      //   break;
      default:
        console.log({ path, value });
    }
  });

  return watchedState;
};

export default view;
