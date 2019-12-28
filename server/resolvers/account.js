import {UserModel} from "../models/user";
const {AccountModel} = require('../models/account');
const User = require('../models/user');

module.exports.account = async (_, args, req) => {
  try {
      let account;

      if(args.userID){
          return await AccountModel.findOne({userID: args.userID});
      } else {
          return account = req.account;
      }
  } catch (e) {
      console.log(e);
  }
};

module.exports.registerAccount = async(_, args, req) => {
  try {
      const user = new UserModel({
          givenName: args.account.givenName,
          familyName: args.account.familyName,
          age: args.account.age,
          nickname: args.account.nickname,
          email: args.account.email,
          userPassword: args.account.userPassword,
          verifiedEmail: false,
          memberSince: new Date(),
          profilePicture: args.account.profilePicture
      });

      const account = new AccountModel({
          givenName: user['givenName'],
          familyName: user['familyName'],
          age: user['age'],
          nickname: user['nickname'],
          email: user['email'],
          userPassword: user['userPassword'],
          verifiedEmail: false,
          memberSince: new Date(),
          profilePicture: user['profilePicture'],
          accountType: user['accountType'],
          lastLogon: new Date(),
          logonCount: 0
      });
      const result = await user.save();
  }catch (e) {
      console.log("Couldn't save user");
      console.log(e);
  }
  try {
      const result2 = await account.save()
  } catch (e) {
      console.log("Couldn't save account");
      console.log(e);
  }
};
