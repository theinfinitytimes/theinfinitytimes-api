const {account, registerAccount, editAccount, deleteAccount} = require('./account');
const {author, addAuthor, editAuthor} = require('./author');
const {group, addGroup, editGroup } = require('./group');
const {post, posts, addPost, editPost} = require('./post');
const {tag, tags, addTag, editTag} = require('./tag');
const {user, editUser} = require('./user');

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
    addTag,
    editUser,
    editTag,
    editPost,
    editGroup,
    editAuthor,
    editAccount,
    deleteAccount
};
