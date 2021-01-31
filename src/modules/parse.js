const parse = (data, state) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data, 'application/xml');
  // console.dir(doc);
  const channel = doc.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const items = channel.querySelectorAll('item');

  const feedPosts = [];
  const feedID = state.feeds.length;
  let postID = state.posts.length;

  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    feedPosts.push({
      feedID,
      postID,
      postTitle,
      postLink,
      postDescription,
    });
    postID += 1;
  });

  return { feed: { feedID, feedTitle, feedDescription }, feedPosts };
};

export default parse;
