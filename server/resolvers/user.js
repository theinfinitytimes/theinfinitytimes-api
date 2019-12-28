const {UserModel} = require('../models/user');

module.exports.user = async (_, args, req) => {
    let user;

    if(args.nickname) {
        try {
            return await UserModel.findOne({nickname: args.nickname});
        } catch (e) {
            console.log(e);
        }
    } else {
        return user = req.user;
    }
};

// Not implementing new user post as this should be done in the account model
