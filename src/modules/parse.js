const parse = (data) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data.contents, 'application/xml');
  const channel = doc.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const feedLink = data.status.url;

  const feed = {
    feedTitle,
    feedDescription,
    feedLink,
  };

  const items = channel.querySelectorAll('item');
  const feedPosts = items
    .map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postLink = item.querySelector('link').textContent;
      const postDescription = item.querySelector('description').textContent;
      return {
        postTitle,
        postLink,
        postDescription,
      };
    })
    .reverse();

  return { feed, feedPosts };
};

export default parse;
