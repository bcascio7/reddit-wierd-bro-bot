const snoowrap = require('snoowrap');
const dotenv = require('dotenv');
const Posts = require('./Posts');
const Comments = require('./Comments');

dotenv.config();

const noRunList = process.env.REDDIT_NO_RUN_LIST;
const ignoreAuthorList = process.env.REDDIT_IGNORE_AUTHOR_LIST;

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

setInterval(() => {
  Posts.getWierdPosts(reddit, noRunList, ignoreAuthorList);
}, 60000);


setInterval(() => {
  Comments.getWierdComments(reddit, noRunList, ignoreAuthorList);
}, 10000);
