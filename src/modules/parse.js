const parse = (data) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data.contents, 'application/xml');
  console.log('doc:', doc);
  const doc2 = domparser.parseFromString(data, 'application/xml');
  console.log('doc2:', doc2);

  const channel = doc.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feedLink = data.status.url;

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
