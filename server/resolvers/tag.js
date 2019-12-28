const Tag = require('../models/tag');

module.exports.tag = async(_, args, req) => {
    try {
        return await Tag.findOne({name: args.name})
    } catch (e) {
        console.log(e);
    }
};

module.exports.addTag = async(_,args, req) => {
    const tag = new Tag({
        name: args.name
    });
    try {
        return await tag.save();
    } catch (e) {
        console.log('Could not save the tag');
        console.log(e);
    }
};
