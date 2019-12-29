import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {UserModel} from "./user";

export const AccountSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    const account =this;
    if(account && account.hasOwnProperty('accountType')) {
        account.isEnabled = account.verifiedEmail;
        account.accountType = 'admin';
        account.lastLogon = new Date();
        account.logonCount = 0;
    }
});


AccountSchema.plugin(timestamps);

export const AccountModel = mongoose.model('Account', AccountSchema);
