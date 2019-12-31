const {UserModel} = require('../models/user');
const {AccountModel} = require('../models/account');

module.exports.account = async (_, args, req) => {
    try {
        if (args.userID !== null) {
            return await AccountModel.findOne({userID: args.userID});
        } else {
            return req.account;
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports.registerAccount = async (_, args, req) => {
    try {
        const user = new UserModel({
            givenName: args.account.givenName,
            familyName: args.account.familyName,
            gender: args.account.gender,
            age: args.account.age,
            nickname: args.account.nickname,
            email: args.account.email,
            userPassword: args.account.userPassword,
            verifiedEmail: false,
            memberSince: new Date(),
            profilePicture: args.account.profilePicture
        });

        const userResult = await user.save();
        let lastAccount = await AccountModel.find({userID: {$exists: true}}).sort({userID: -1}).limit(1);
        if(Array.isArray(lastAccount) && lastAccount.length > 0){
            lastAccount = lastAccount[0]
        }
        const account = new AccountModel({
            user: userResult._id,
            userID: lastAccount.userID + 1,
            accountType: args.account.accountType || 'guest',
            lastLogon: new Date(),
            logonCount: 0,
            isEnabled: false
        });
        if (Array.isArray(lastAccount) && lastAccount.length === 0) {
            account.userID = 0;
        }
        return await account.save();
    } catch (e) {
        console.log("Couldn't save user or account");
        console.log(e);
    }
};
