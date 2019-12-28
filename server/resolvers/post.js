const Post = require('../models/post');

module.exports.post = async(_, args, req) => {
    try {
        return await Post.findOne({id: args.id})
    } catch (e) {
        console.log(e);
    }
};
module.exports.posts = async(_, args, req) => {
    try {
        return await Post.findMany({id: {$exists: true}});
    } catch (e) {
        console.log(e);
    }
};
module.exports.addPost = async(_,args, req) => {
    const post = new Post({
        title: args.title,
        body: args.body,
        author: args.author,
        picture: args.picture
    });
    try {
        return await post.save();
    } catch (e) {
        console.log('Could not save the post');
        console.log(e);
    }
};
