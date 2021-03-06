const {AccountModel} = require('../models/account');
const {PostModel} = require('../models/post');
const {CommentModel} = require('../models/comment');
const {ForbiddenError} = require('apollo-server-express');

module.exports.getComment = async (_, args, req) => {
    try {
        return await CommentModel.findOne({id: args.id})
    } catch (e) {
        console.log(e);
    }
};
module.exports.getAllComments = async (_, args, req) => {
    try {
        return await CommentModel.find({_id: {$exists: true}});
    } catch (e) {
        console.log(e);
    }
};
module.exports.addComment = async (_, args, req) => {
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    console.log(reqUser);
    if(reqUser) {
        let lastComment = await CommentModel.find({id: {$exists: true}}).sort({id: -1}).limit(1);
        if(Array.isArray(lastComment) && lastComment.length > 0){
            lastComment = lastComment[0]
        }
        const comment = new CommentModel({
            id: ++lastComment.id,
            body: args.comment.body,
            user: args.comment.user,
            post: args.comment.post,
            dateCreated: new Date(),
            lastModified: null,
            modifiedBy: null
        });
        if (Array.isArray(lastComment) && lastComment.length === 0) {
            comment.id = 0;
        }
        const post = await PostModel.findOne({_id: args.comment.post});
        if(!post)
            throw new Error("No post with that _id was found. The comment wasn't saved. Aborting...");
        if(!post._doc.comments){
            post.comments = [];
        }
        post._doc.comments.push(comment.id);
        await post.save();
        return await comment.save();
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};

module.exports.editComment = async (_, args, req) => {
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    if(reqUser) {
        let comment = await CommentModel.findOne({id: args.comment.id});
        if(comment){
            if(comment.user.toString() === reqUser || reqUser.accountType === 'admin'){
                if(comment.post === args.comment.post) {
                    const newComment = args.comment;
                    newComment.lastModified = new Date();
                    newComment.modifiedBy = reqUser._id;
                    return CommentModel.findOneAndUpdate({id: args.comment.id}, {$set: newComment}, {new: true});
                } else {
                    throw new Error(`Comment post _id and args post _id don't match`);
                }
            } else {
                throw new ForbiddenError('403-Forbidden')
            }
        } else {
            throw new Error('Comment was not found');
        }
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};

module.exports.deleteComment = async (_, args, req) => {
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    if(reqUser) {
        let comment = await CommentModel.findOne({id: args.comment.id});
        if(comment){
            if(comment.user.toString() === reqUser || reqUser.accountType === 'admin'){
                if(comment.post.toString() === args.comment.post) {
                    return CommentModel.findOneAndDelete({id: args.comment.id});
                } else {
                    throw new Error(`Comment post _id and args post _id don't match`);
                }
            } else {
                throw new ForbiddenError('403-Forbidden')
            }
        } else {
            throw new Error('Comment was not found');
        }
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};
