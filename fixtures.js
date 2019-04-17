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
        {title: '8 mile', year: 2010, artist: artists[0]._id, image: 'eminemAlbum.jpeg'},
        {title: 'Eminem show', year: 2008, artist: artists[0]._id, image: 'eminemAlbum2.jpeg'},
        {title: 'Yeah', year: 2011, artist: artists[1]._id, image: 'usherAlbum.jpg'},
        {title: 'Usher show', year: 2008, artist: artists[1]._id, image: 'usherAlbum2.jpeg'}
    );

    await Track.create(
        {title: '8 mile', album: albums[0]._id, duration: "3:52", number: 1},
        {title: 'Love the way you lie', album: albums[0]._id, duration: "3:23", number: 2},
        {title: 'Stan', album: albums[1]._id, duration: "3:45", number: 1},
        {title: 'Recovery', album: albums[1]._id, duration: "3:00", number: 2},
        {title: 'Black heart', album: albums[2]._id, duration: "3:52", number: 1},
        {title: 'Yeah', album: albums[2]._id, duration: "2:52", number: 2},
        {title: 'Burn', album: albums[3]._id, duration: "3:54", number: 1},
        {title: 'I dont mind', album: albums[3]._id, duration: "3:54", number: 2}
    );


    await connection.close();
};


run().catch(error => {
    console.log('Something went wrong', error);
});