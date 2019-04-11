const mongoose = require('mongoose');
const config = require('./config');

const Artist = require('./models/Artist');
const Album = require('./models/Album');
const Track = require('./models/Track');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(config.dbURL, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }

    const artists = await Artist.create(
        {artist: 'Eminem', info: 'rapper', image: 'eminem.jpeg'},
        {artist: 'Usher', info: 'rnb', image: 'usher.jpeg'}
    );

    const albums = await Album.create(
        {title: 'Eminem show', year: 2008, artist: artists[0]._id, image: 'eminemAlbum.jpeg'},
        {title: 'Usher show', year: 2011, artist: artists[1]._id, image: 'usherAlbum.jpg'}
    );

    const tracks = await Track.create(
        {title: 'Eminem song', album: albums[0]._id, duration: 3},
        {title: 'Eminem 2 song', album: albums[0]._id, duration: 5},
        {title: 'Usher song', album: albums[1]._id, duration: 4},
        {title: 'Usher 2 song', album: albums[1]._id, duration: 2.5}
    );

    await  User.create(
        {username: 'Mila', password: "123"},
        {username: 'Pasha', password: "123"}
    );

    await connection.close();
};


run().catch(error => {
    console.log('Something went wrong', error);
});