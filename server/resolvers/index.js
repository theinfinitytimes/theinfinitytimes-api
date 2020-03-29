const {account, registerAccount, editAccount, deleteAccount, findAccountById} = require('./account');
const {author, addAuthor, editAuthor, deleteAuthor} = require('./author');
const {group, addGroup, editGroup, deleteGroup } = require('./group');
const {post, posts, addPost, editPost, deletePost, postsByTag} = require('./post');
const {tag, tags, addTag, editTag, deleteTag} = require('./tag');
const {user, editUser, findUserById} = require('./user');
const {getComment, getAllComments, addComment, editComment, deleteComment} = require('./comment');

module.exports.Query = {
    account,
    author,
    findAccountById,
    findUserById,
    getAllComments,
    getComment,
    group,
    post,
    posts,
    postsByTag,
    tag,
    tags,
    user
};



module.exports.Mutation = {
    registerAccount,
    addAuthor,
    addComment,
    addGroup,
    addPost,
    addTag,
    editUser,
    editTag,
    editPost,
    editGroup,
    editAuthor,
    editAccount,
    editComment,
    deleteAccount,
    deleteAuthor,
    deleteComment,
    deleteGroup,
    deletePost,
    deleteTag
};
