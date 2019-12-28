import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {composeWithMongoose} from 'graphql-compose-mongoose';

require('mongoose-type-email');
require('mongoose-type-url');

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

export const UserSchema = new Schema({
    givenName: {
        type: String,
        required: true
    },
    familyName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary'],
        required: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    userPassword: {
        type: String,
        required: true
    },
    verifiedEmail: {
        type: Boolean,
        required: true
    },
    memberSince: {
        type: Date,
        required: true
    },
    profilePicture: {
        type: mongoose.SchemaTypes.Url,
        required: false
    }
}, {collection: 'User'});

UserSchema.pre('save', function (next) {
    const user = this;
    if (user && user.hasOwnProperty('userPassword') && !user.isModified('userPassword')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.userPassword, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.userPassword = hash;
            next();
        })
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.userPassword, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


UserSchema.plugin(timestamps);

export const UserModel = mongoose.model('User', UserSchema);

