const {UserModel} = require('../models/user');
const {ForbiddenError} = require('apollo-server-express');

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
    req.user = {...req.user, ...(await req.user.checkAuthentication())};
    const reqUser = req.user._doc;
    try {
        const user = await UserModel.findOne({nickname: args.user.nickname});
        if (reqUser && reqUser.accountType && (reqUser.accountType === 'admin' || reqUser.user.toString() === user._id)) {
            if (args.user.email && args.user.email !== user.email) {
                args.user.email = user.email;
            }
            return await UserModel.findOneAndUpdate({nickname: user.nickname}, {$set: args.user}, {new: true});
        } else {
            throw new ForbiddenError('403-Forbidden');
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports.findUserById = async(_, args, req)=> {
    try {
        return await UserModel.findById(args._id);
    } catch (e) {
        console.log(e);
        throw e;
    }
};
