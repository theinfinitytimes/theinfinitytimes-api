import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {composeWithMongoose} from 'graphql-compose-mongoose';

const AuthorSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        unique: true
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: 'Post',
        required: false
    }
}, {collection: 'Author'});
AuthorSchema.plugin(timestamps);

export const AuthorModel = mongoose.model('Author', AuthorSchema);
