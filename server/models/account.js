import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {UserModel, UserSchema} from "./user";

export const AccountSchema = new Schema({
    isEnabled: {
        type: Boolean,
        required: true
    },
    userID: {
        type: Number,
        required: true,
        unique: true
    },
    accountType: {
        type: String,
        enum: ['admin', 'author', 'guest'],
        required: true
    },
    lastLogon: {
        type: Date,
        required: true
    },
    logonCount: {
        type: Number,
        required: true
    }
}, {collection: 'Account'});

AccountSchema.pre('save', async function (next) {
    const account = this;
    const lastAccount = await AccountModel.findAll({userID: {$exists: true}}).sort({userID: -1}).limit(1);
    account.userID = lastAccount.userID + 1;
    return next();
});


AccountSchema.plugin(timestamps);

export const AccountModel = UserModel.discriminator('Account', AccountSchema);

module.exports = AccountModel;

