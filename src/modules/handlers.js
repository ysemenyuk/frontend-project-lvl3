/* eslint-disable no-param-reassign */
import uniqueId from 'lodash/uniqueId.js';
import parse from './parse.js';
import {
  getFeed,
  validInput,
  validUrl,
  validResponse,
} from './utils.js';

const getNewPosts = (existsPost, feedPosts) => {
  const [{ feedTitle }] = feedPosts;
  const existsTitles = existsPost
    .filter((post) => feedTitle === post.feedTitle)
    .map((post) => post.postTitle);

  const newPosts = feedPosts
    .filter((post) => !existsTitles.includes(post.postTitle))
    .map((post) => ({ ...post, postId: uniqueId() }));

  return newPosts;
};

const updateFeed = (url, watched, updateTimeout) => {
  getFeed(url)
    .then((response) => {
      const { feedPosts } = parse(response.data);
      const newPosts = getNewPosts(watched.posts, feedPosts);
      if (newPosts.length) {
        watched.posts = [...newPosts, ...watched.posts];
        watched.newPosts = [...newPosts];
      }
    })
    .catch((err) => {
      console.log('catch:', err.message);
      // watched.form = { status: 'error', error: 'updateError' };
    })
    .finally(() => {
      setTimeout(() => updateFeed(url, watched, updateTimeout), updateTimeout);
    });
};

export const formHandler = (e, watched, updateTimeout) => {
  e.preventDefault();
  const url = e.target.value;

  const errorInput = validInput(url);
  if (errorInput) {
    watched.form = { status: 'error', error: errorInput };
    return;
  }

  const errorUrl = validUrl(url, watched.feeds);
  if (errorUrl) {
    watched.form = { status: 'error', error: errorUrl };
    return;
  }

  watched.form = { status: 'loading', error: '' };

  getFeed(url)
    .then((response) => {
      const errorRss = validResponse(response.data);
      if (errorRss) {
        watched.form = { status: 'error', error: errorRss };
        return;
      }

      watched.form = { status: 'loaded', error: '' };

      const feedData = parse(response.data);

      const feed = { ...feedData.feed, feedId: uniqueId() };
      const feedPosts = feedData.posts.map((post) => ({ ...post, postId: uniqueId() }));

      watched.allFeeds = [feed, ...watched.feeds];
      watched.newFeed = feed;

      watched.allPosts = [...feedPosts, ...watched.posts];
      watched.newPosts = feedPosts;

      setTimeout(() => updateFeed(url, watched, updateTimeout), updateTimeout);
    })
    .catch((err) => {
      console.log('catch:', err.message);
      watched.form = { status: 'error', error: 'networkError' };
    });
};

const makeModal = (id, posts) => {
  const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const fullArticle = modal.querySelector('.full-article');

  const post = posts.find(({ postID }) => postID === id);
  const { postTitle, postDescription, postLink } = post;

  modalTitle.textContent = postTitle;
  modalBody.textContent = postDescription;
  fullArticle.href = postLink;
};

export const postsHandler = (e, watched) => {
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
    const id = parseInt(e.target.getAttribute('data-post-id'), 10);
    watched.readed = id;

    makeModal(id, watched.posts);
  }
};
