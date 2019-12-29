import {AuthorModel} from "../models/author";

const {PostModel} = require('../models/post');

module.exports.post = async(_, args, req) => {
    try {
        return await PostModel.findOne({id: args.id})
    } catch (e) {
        console.log(e);
    }
};
module.exports.posts = async(_, args, req) => {
    try {
        return await PostModel.find({_id: {$exists: true}});
    } catch (e) {
        console.log(e);
    }
};
module.exports.addPost = async(_,args, req) => {
    let lastPost = await PostModel.find({id: {$exists: true}}).sort({id: -1}).limit(1);
    if(Array.isArray(lastPost) && lastPost.length > 0){
        lastPost = lastPost[0]
    }
    const post = new PostModel({
        title: args.post.title,
        body: args.post.body,
        author: args.post.author,
        picture: args.post.picture,
        id: lastPost['id'] + 1,
        dateCreated: new Date(),
        tag: args.post.tag
    });
    if(Array.isArray(lastPost) && lastPost.length === 0) {
        post.id = 0;
    }
    try {
        const result = await post.save();
        let author = await AuthorModel.find({_id: args.post.author});
        if(Array.isArray(author) &&  author.length > 0){
            author = author[0];
        }
        author['posts'].push(result._id);
        await author.save();
        return result;
    } catch (e) {
        console.log('Could not save the post');
        console.log(e);
    }
};
