import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {composeWithMongoose} from 'graphql-compose-mongoose';

const CommentSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    lastModified: {
        type: Date,
        required: false
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {collection: 'Comment'});


CommentSchema.plugin(timestamps);

export const CommentModel =  mongoose.model('Comment', CommentSchema);
