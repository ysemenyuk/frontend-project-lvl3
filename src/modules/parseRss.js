const parse = (contents) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(contents, 'application/xml');
  const rss = doc.querySelector('rss');

  if (!rss) {
    return null;
  }

  const channel = doc.querySelector('channel');
  const items = channel.querySelectorAll('item');

  const feed = {
    feedTitle: channel.querySelector('title').textContent,
    feedDescription: channel.querySelector('description').textContent,
  };

  const feedPosts = [];

  items.forEach((item) => {
    const post = {
      postTitle: item.querySelector('title').textContent,
      postDescription: item.querySelector('description').textContent,
      postLink: item.querySelector('link').textContent,
    };
    feedPosts.unshift(post);
  });

  return { feed, feedPosts };
};

export default parse;
