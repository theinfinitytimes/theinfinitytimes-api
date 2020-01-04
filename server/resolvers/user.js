const {UserModel} = require('../models/user');

module.exports.user = async (_, args, req) => {

    if(args.nickname) {
        try {
            return await UserModel.findOne({nickname: args.nickname});
        } catch (e) {
            console.log(e);
        }
    } else {
        return req.user;
    }
};

// Not implementing new user post as this should be done in the account model
module.exports.editUser = async (_, args, req) => {
    try {
        const user = await UserModel.findOne({nickname: args.user.nickname});
        if(args.user.email && args.user.email !== user.email) {
            args.user.email = user.email;
        }
        return await UserModel.findOneAndUpdate({nickname: user.nickname}, {$set: args.user}, {new: true});
    } catch (e) {
        console.log(e);
    }
};
