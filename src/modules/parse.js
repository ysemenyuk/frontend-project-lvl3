const parse = (data, state) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data.contents, 'application/xml');
  const channel = doc.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feedLink = data.status.url;
  const feedID = state.feeds.length;

  const feed = {
    feedID,
    feedTitle,
    feedDescription,
    feedLink,
  };

  const items = channel.querySelectorAll('item');
  const feedPosts = [];
  let postID = state.posts.length;

  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    feedPosts.unshift({
      feedID,
      postID,
      postTitle,
      postLink,
      postDescription,
    });
    postID += 1;
  });

  return { feed, feedPosts };
};

export default parse;
