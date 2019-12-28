import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {composeWithMongoose} from 'graphql-compose-mongoose';

const GroupSchema = new Schema({
   name: {
       type: String,
       required: true
   },
    members: {
       type: [Schema.Types.ObjectId],
        ref: 'Account',
        required: true
    }
}, {collection: 'Group'});

GroupSchema.plugin(timestamps);

export const GroupModel = mongoose.model('Group', GroupSchema);
