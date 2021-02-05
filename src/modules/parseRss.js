const parse = (data) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data.contents, 'application/xml');
  // console.log('doc:', doc);

  const rss = doc.querySelector('rss');
  // console.log('rss', rss);

  if (!rss) {
    return null;
  }

  const channel = doc.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feedLink = channel.querySelector('link').textContent;

  const feed = {
    feedTitle,
    feedDescription,
    feedLink,
  };

  const feedPosts = [];

  const items = channel.querySelectorAll('item');
  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    const post = {
      postTitle,
      postDescription,
      postLink,
    };
    feedPosts.unshift(post);
  });

  return { feed, feedPosts };
};

export default parse;
