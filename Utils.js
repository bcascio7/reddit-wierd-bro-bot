const fs = require('fs');

const weirdBroCopyPasta = 'Bro come on bro wtf everybody knows weird is spelled weird bro! come on bro wtf it\'s okay though '
+ 'I don\'t want to hurt your feelings bro but rather tell you gently of your error before '
+ 'others more hostile than I come forth to reprimand you for your mistake! And bro! Lest '
+ 'you forget, many others have made a similar mistake in the past. In fact I\'d say the '
+ 'mistake has been made many times! Just remember bro that it is \'I\' before \'E\' except after '
+ '\'C\' and except in that one word that is kind of WEIRD (the hint here is that the "kind of weird" '
+ 'word is in fact the word weird!) carry on bro but still wtf come on man ';
const filterWierdItems = async (unfilteredPosts, noRunList, ignoreAuthorList) => {
  const filteredPosts = unfilteredPosts.filter(async (unfilteredPost) => {
    const author = await unfilteredPost.author.name;
    const subreddit = unfilteredPost.subreddit_name_prefixed.replace('r/', '');
    return !ignoreAuthorList.includes(author) && !noRunList.includes(subreddit);
  });

  return filteredPosts;
};

let nextAvailableCallTime;

const commentSort = (commentA, commentB) => {
  if (commentB.created_utc > commentA.created_utc) {
    return 1;
  }

  if (commentB.created_utc < commentA.created_utc) {
    return -1;
  }
  return 0;
};

const getCreatedByUtcDate = (createdByEpoch) => new Date(createdByEpoch * 1000);

const writeResultsToFile = (fileName, results) => {
  fs.writeFile(fileName, JSON.stringify(results), (err) => {
    if (err) {
      console.log(`Error writing {$fileName}: ${err}`);
    }
  });
};

const replyWithWeirdBro = async (weirdItems, redditApi) => {
  console.log('Replying bro');
  let adjustedWierdItems = weirdItems.slice();

  if (weirdItems.length > 40) {
    adjustedWierdItems = adjustedWierdItems.slice(39);
  }
  const repliedTo = adjustedWierdItems.map(async (wierdItem) => {
    const currentTime = new Date();
    try {
      if (!nextAvailableCallTime || currentTime > nextAvailableCallTime) {
        const wierdReply = await redditApi.getSubmission(wierdItem.name).reply(weirdBroCopyPasta);

        if (wierdReply) {
          return wierdItem;
        }
      }
    } catch (err) {
      console.log(`Error replying bro: ${err}`);

      const minsIndex = err.indexOf('minutes');
      const secsIndex = err.indexOf('seconds');

      let sleepTime;

      if (minsIndex < 0) {
        sleepTime = err.substring(minsIndex - 3, minsIndex);

        if (sleepTime === 0) {
          sleepTime = 10;
        }
      }

      if (secsIndex < 0) {
        sleepTime = 1;
      }

      nextAvailableCallTime = new Date().setMinutes(sleepTime);
    }
  });

  return repliedTo;
};


exports.filterWierdItems = filterWierdItems;
exports.commentSort = commentSort;
exports.getCreatedByUtcDate = getCreatedByUtcDate;
exports.writeResultsToFile = writeResultsToFile;
exports.replyWithWeirdBro = replyWithWeirdBro;
