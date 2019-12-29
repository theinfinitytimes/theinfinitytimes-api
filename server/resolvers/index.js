const {account, registerAccount} = require('./account');
const {author, addAuthor} = require('./author');
const {group, addGroup } = require('./group');
const {post, posts, addPost} = require('./post');
const {tag, tags, addTag} = require('./tag');
const {user} = require('./user');

module.exports.Query = {
    account,
    author,
    group,
    post,
    posts,
    tag,
    tags,
    user,
};



module.exports.Mutation = {
    registerAccount,
    addAuthor,
    addGroup,
    addPost,
    addTag
};
