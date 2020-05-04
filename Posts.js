const Utils = require('./Utils');

const getLatestPosts = async (redditApi) => {
  const subreddit = await redditApi.getSubreddit('all');

  // Limit of 500 gets all posts within the last ~75 seconds
  // Increase limit size for a larger pool if you want to make fewer calls per min
  const newPosts = await subreddit.getNew({ limit: 500 });
  return newPosts;
};

const getWierdPosts = async (redditApi, noRunList, ignoreAuthorList) => {
  console.log('Get Wierd Posts');

  const latestPosts = await getLatestPosts(redditApi);
  const wierdPosts = latestPosts.filter((newPost) => {
    if (newPost.title) {
      const formattedTitle = newPost.title.toLowerCase().trim().replace(' ', '');
      return formattedTitle.includes('wierd');
    }

    if (newPost.selftext) {
      const formattedText = newPost.selftext.toLowerCase().trim().replace(' ', '');
      return formattedText.includes('wierd');
    }

    return false;
  });

  const filteredWierdPosts = await Utils.filterWierdItems(wierdPosts, noRunList, ignoreAuthorList);


  if (filteredWierdPosts.length) {
    console.log(filteredWierdPosts);

    const repliedToPosts = Utils.replyWithWeirdBro(filteredWierdPosts, redditApi);

    Utils.writeResultsToFile('newComments.txt', JSON.stringify(filteredWierdPosts));
  }
};

exports.getWierdPosts = getWierdPosts;
