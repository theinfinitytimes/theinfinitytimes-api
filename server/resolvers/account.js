const {UserModel} = require('../models/user');
const {AccountModel} = require('../models/account');
const {AuthorModel} = require('../models/author');

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

module.exports.editAccount = async(_, args, req)=> {
  try{
      let account = await AccountModel.findById(args.account._id);
      if(account && (typeof account === 'object')){
          if(account.user.toString() !== args.account.user){
              throw new Error("The user associated with an account cannot be changed");
          }
          if ( account.userID !== args.account.userID){
              throw new Error("The userID cannot be changed");
          }
          if (!(args.account.lastLogon)){
              args.account.lastLogon = new Date();
          }
          if( !(args.account.logonCount)){
              args.account.logonCount = account.logonCount;
          }
          return await AccountModel.findOneAndUpdate({_id: args.account._id}, {$set: args.account}, {new: true});
      } else {
          throw new Error ("Couldn't find an account with this _id");
      }
  } catch (e) {
      console.log(e);
      throw new Error(e);
  }
};

module.exports.deleteAccount = async(_, args, req) => {
  try {
      let account = await AccountModel.findById(args.account._id);
      if( account && (typeof account === 'object')){
          if(account.user.toString() !== args.account.user){
              throw new Error("The user associated with this account is wrong");
          }
          if ( account.userID !== args.account.userID){
              throw new Error("The userID of this account is wrong");
          }
          let author = await AuthorModel.findOne({account: args.account._id});
          if(author && Array.isArray(author) && author.length > 0){
              author = author[0];
          }
          if(author) {
              await AuthorModel.findByIdAndDelete(author._id);
          }
          let user = await UserModel.findById(args.account.user.toString());
          if(user && (typeof user === 'object')){
              const result = await UserModel.findByIdAndDelete(args.account.user);
              if(result) {
                  return await AccountModel.findByIdAndDelete(args.account._id);
              }
          } else {
              throw new Error ("An error occurred trying to find the user. Try again later");
          }
      } else {
          throw new Error(" Couldn't find the specified account");
      }
  } catch (e) {
      console.log(e);
      throw e;
  }
};

module.exports.findAccountById = async(_, args, req)=> {
    try {
        return await AccountModel.findById(args._id);
    } catch (e) {
        console.log(e);
        throw e;
    }
};
