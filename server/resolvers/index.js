const {account, registerAccount, editAccount, deleteAccount, findAccountById} = require('./account');
const {author, addAuthor, editAuthor, deleteAuthor} = require('./author');
const {group, addGroup, editGroup, deleteGroup } = require('./group');
const {post, posts, addPost, editPost, deletePost} = require('./post');
const {tag, tags, addTag, editTag, deleteTag} = require('./tag');
const {user, editUser} = require('./user');

module.exports.Query = {
    account,
    author,
    findAccountById,
    group,
    post,
    posts,
    tag,
    tags,
    user
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
    deleteAccount,
    deleteAuthor,
    deleteGroup,
    deletePost,
    deleteTag
};
