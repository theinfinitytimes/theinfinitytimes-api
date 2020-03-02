const {TagModel} = require('../models/tag');
const {ObjectId} = require('mongodb').ObjectId;
const {ForbiddenError} = require('apollo-server-express');

module.exports.tag = async(_, args, req) => {
    try {
        return await TagModel.findOne({name: args.name})
    } catch (e) {
        console.log(e);
    }
};

module.exports.tags = async (_, args, req) => {
  try {
      return await TagModel.find({});
  } catch (err) {
      console.log(err);
  }
};

module.exports.addTag = async(_,args, req) => {
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    if(reqUser && reqUser.accountType && reqUser.accountType === 'admin') {
        let lastTag = await TagModel.find({}).sort({_id: -1}).limit(1);
        let tags = await TagModel.find({name: args.tag.name});
        if (Array.isArray(tags) && tags.length > 0) {
            throw new Error("A tag with this name already exists");
        }
        if (Array.isArray(lastTag) && lastTag.length > 0) {
            lastTag = lastTag[0]
        }
        const tag = new TagModel({
            _id: lastTag._id + 1,
            name: args.tag.name
        });
        if (Array.isArray(lastTag) && lastTag.length === 0) {
            tag._id = 0;
        }
        try {
            return await tag.save();
        } catch (e) {
            console.log('Could not save the tag');
            console.log(e);
        }
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};

module.exports.editTag = async (_, args, req) => {
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    if(reqUser && reqUser.accountType && reqUser.accountType === 'admin') {
        const tag = await TagModel.findOne({_id: args.tag._id});
        if (tag) {
            try {
                return await TagModel.findOneAndUpdate({_id: args.tag._id}, {$set: args.tag}, {new: true});
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};

module.exports.deleteTag = async (_, args, req) => {
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    if(reqUser && reqUser.accountType && reqUser.accountType === 'admin') {
        const tag = await TagModel.findById(args.tag._id);
        if (tag) {
            if (tag.name !== args.tag.name) {
                throw new Error("The name of tags doesn't match");
            }
            try {
                return await TagModel.findByIdAndDelete(args.tag._id);
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    } else {
        throw new ForbiddenError('403-Forbidden');
    }
};
