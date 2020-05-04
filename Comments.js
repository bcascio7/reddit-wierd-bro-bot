const Utils = require('./Utils');

const getLatestComments = async (redditApi) => {
  const subreddit = await redditApi.getSubreddit('all');
  const newComments = await subreddit.getNewComments({ limit: 500 });

  newComments.sort(Utils.commentSort);
  return newComments;
};

const getWierdComments = async (redditApi, noRunList, ignoreAuthorList) => {
  console.log('Get Wierd Comments');

  const latestComments = await getLatestComments(redditApi);

  console.log('Most recent and oldest comments');
  console.log(Utils.getCreatedByUtcDate(latestComments[0].created_utc));
  console.log(Utils.getCreatedByUtcDate(latestComments[499].created_utc));

  const wierdComments = latestComments.filter((newComment) => {
    if (newComment.body) {
      const formattedBody = newComment.body.toLowerCase().trim().replace(' ', '');
      return formattedBody.includes('wierd');
    }

    return false;
  });

  const filteredWierdComments = await Utils.filterWierdItems(wierdComments, noRunList, ignoreAuthorList);

  if (filteredWierdComments.length) {
    console.log(filteredWierdComments);
    const repliedToPosts = Utils.replyWithWeirdBro(filteredWierdComments, redditApi);

    Utils.writeResultsToFile('wierdComments.txt', JSON.stringify(repliedToPosts));
  }
};

exports.getWierdComments = getWierdComments;
