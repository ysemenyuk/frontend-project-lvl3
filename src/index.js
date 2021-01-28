// import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
// import * as yup from 'yup';
// import onChange from 'on-change';

// import render from './render.js';
import parse from './parse.js';

const app = () => {
  const state = {
    urls: [],
    feeds: [],
    posts: [],
    formState: '',
    errors: '',
  };

  // const watchedState = onChange(state, (path, value) => {
  //   console.log(path, value);
  //   render(watchedState);
  // });

  const statusMessage = {
    error: 'Network error',
    loading: 'Loading...',
    loaded: 'Rss has been loaded',
    exist: 'Rss already exists',
    badSource: 'This source doesnt contain valid rss',
    notValidUrl: 'Must be valid url',
  };

  const form = document.querySelector('form');
  const feedsCol = document.querySelector('.feeds');
  const postsCol = document.querySelector('.posts');
  const feedback = document.querySelector('.feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = formData.get('url');
    // console.log(1, url);
    if (state.urls.includes(url)) {
      feedback.textContent = statusMessage.exist;
      return;
    }
    state.urls.push(url);
    feedback.textContent = statusMessage.loading;
    axios.get(url)
      .then((response) => {
        // console.log(response.data);
        feedback.textContent = statusMessage.loaded;
        const { feed, feedPosts } = parse(response.data);
        state.feeds.push(feed);
        state.posts.push(...feedPosts);
        console.log(state);
      })
      .then(() => {
        // console.log(data);
        const feedsTitle = document.createElement('h2');
        feedsTitle.textContent = 'Feeds';
        feedsCol.append(feedsTitle);
        const feeds = document.createElement('ul');

        (state.feeds).forEach(({ feedTitle, feedDescription }) => {
          const feed = document.createElement('li');
          feed.innerHTML = `<h3>${feedTitle}</h3><p>${feedDescription}</p>`;
          feeds.append(feed);
        });

        feedsCol.append(feeds);

        const postsTitle = document.createElement('h2');
        postsTitle.textContent = 'Posts';
        postsCol.append(postsTitle);
        const posts = document.createElement('ul');

        (state.posts).forEach(({ postTitle, postLink }) => {
          const post = document.createElement('li');
          post.innerHTML = `<a href="${postLink}">${postTitle}</a>`;
          posts.append(post);
        });

        postsCol.append(posts);
      });
  });
};

app();
