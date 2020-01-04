import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {composeWithMongoose} from 'graphql-compose-mongoose';

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        unique: true,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
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
        ref: 'Author',
        required: false
    },
    picture: {
        type: [mongoose.SchemaTypes.Url],
        required: false
    },
    tags: {
        type: [Number],
        required: false
    }
}, {collection: 'Post'});


PostSchema.plugin(timestamps);

export const PostModel =  mongoose.model('Post', PostSchema);
