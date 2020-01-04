const {GroupModel} = require('../models/group');

module.exports.group = async(_, args, req) => {
    try {
        return await GroupModel.findOne({name: args.name})
    } catch (e) {
        console.log(e);
    }
};

module.exports.addGroup = async(_,args, req) => {
    let lastGroup = await GroupModel.find({id: {$exists: true}}).sort({id: -1}).limit(1);
    if (Array.isArray(lastGroup) && lastGroup.length > 0) {
        lastGroup = lastGroup[0]
    }
    const group = new GroupModel({
        id: lastGroup['id'] + 1,
        name: args.group.name,
        members: []
    });
    if(Array.isArray(lastGroup) && lastGroup.length === 0){
        group.id = 0;
    }
    if(args.group.members && Array.isArray(args.group.members) && args.group.members.length > 0){
        args.group.members.forEach(x =>{
           group.members.push(x);
        });
    }
    try {
        return await group.save();
    } catch (e) {
        console.log('Could not save the group');
        console.log(e);
    }
};

module.exports.editGroup = async (_, args, req) => {
  try {
      return await GroupModel.findOneAndUpdate({id: args.group.id}, {$set: args.group}, {new: true});
  } catch (e){
      console.log(e);
      throw new Error(e);
  }
};

module.exports.deleteGroup = async (_, args, req) => {
  try {
      let group = await GroupModel.findById(args.group._id);
      if(args.group.name !== group.name){
          throw new Error("The name of group doesn't match");
      }
      if (args.group.id !== group.id){
          throw new Error("The id of the group is wrong")
      }
      return await GroupModel.findByIdAndDelete(args.group._id);
  } catch (e) {
      console.log(e);
      throw e;
  }
};
