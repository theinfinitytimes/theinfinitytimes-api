const {GroupModel} = require('../models/group');

module.exports.group = async(_, args, req) => {
    try {
        return await GroupModel.findOne({name: args.name})
    } catch (e) {
        console.log(e);
    }
};

module.exports.addGroup = async(_,args, req) => {
    const group = new GroupModel({
        name: args.group.name,
        members: args.group.members || []
    });
    try {
        return await group.save();
    } catch (e) {
        console.log('Could not save the group');
        console.log(e);
    }
};
