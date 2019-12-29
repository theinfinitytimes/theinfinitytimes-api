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
