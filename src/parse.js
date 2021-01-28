/* eslint-disable object-curly-newline */
const parse = (data) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data, 'text/xml');
  console.dir(doc);
  const channel = doc.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;

  const feedPosts = [];
  const items = channel.querySelectorAll('item');
  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    feedPosts.push({ feedTitle, postTitle, postLink, postDescription });
  });

  return { feed: { feedTitle, feedDescription }, feedPosts };
};

export default parse;
