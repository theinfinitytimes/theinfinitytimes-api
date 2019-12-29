import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {composeWithMongoose} from 'graphql-compose-mongoose';

const TagSchema = new Schema({
   _id: {
       type: Number,
       required: true
   },
    name: {
       type: String,
        required: true
    }
}, {collection: 'Tag'});

TagSchema.plugin(timestamps);

export const TagModel = mongoose.model('Tag', TagSchema);
