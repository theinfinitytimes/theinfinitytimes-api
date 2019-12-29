const {TagModel} = require('../models/tag');
const {ObjectId} = require('mongodb').ObjectId;

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
    let lastTag = await TagModel.find({}).sort({_id: -1}).limit(1);
    let tags = await TagModel.find({name: args.tag.name});
    if(Array.isArray(tags) && tags.length > 0){
        throw new Error("A tag with this name already exists");
    }
    if(Array.isArray(lastTag) && lastTag.length > 0){
        lastTag = lastTag[0]
    }
    const tag = new TagModel({
        _id: lastTag._id + 1,
        name: args.tag.name
    });
    if(Array.isArray(lastTag) && lastTag.length === 0){
        tag._id = 0;
    }
    try {
        return await tag.save();
    } catch (e) {
        console.log('Could not save the tag');
        console.log(e);
    }
};