import mongoose, {Schema} from 'mongoose';
import timestamps from 'mongoose-timestamp';
import {composeWithMongoose} from 'graphql-compose-mongoose';

const TagSchema = new Schema({
   _id: {
       type: Schema.Types.ObjectId,
       required: true
   },
    name: {
       type: String,
        required: true
    }
}, {collection: 'Tag'});

TagSchema.pre('save', async function (next) {
    const tag = this;
    // This way we have an autoincrement in the _id of tag
    const lastTag = await Tag.findAll({_id: {$exists: true}}).sort({_id: -1}).limit(1);
    tag._id = lastTag._id + 1;
    return next();
});

TagSchema.plugin(timestamps);

export const TagModel = mongoose.model('Tag', TagSchema);
