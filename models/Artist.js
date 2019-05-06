const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    artist: {
        type: String, required: true
    },
    info: {
        type: String, required: true
    },
    image: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    published: {
        type: Boolean,
        default: false
    }
});

const Artist = mongoose.model('Artist', ArtistSchema);
module.exports = Artist;