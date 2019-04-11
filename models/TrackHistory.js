const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrackHistorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    track: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
        required: true
    },
    datetime: {
        type: String, required: true
    }
});

const TrackHistory = mongoose.model('TrackHistory', TrackHistorySchema);
module.exports = TrackHistory;