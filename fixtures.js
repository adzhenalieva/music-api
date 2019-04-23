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
        {title: 'Lose yourself', album: albums[0]._id, duration: "3:52", number: 1, link: "hhttps://www.youtube.com/embed/_Yhyp-_hX2s"},
        {title: 'Love the way you lie', album: albums[0]._id, duration: "3:23", number: 2, link: "https://www.youtube.com/embed/uelHwf8o7_U"},
        {title: 'Stan', album: albums[1]._id, duration: "3:45", number: 1, link: "https://www.youtube.com/embed/gOMhN-hfMtY"},
        {title: 'Not afraid', album: albums[1]._id, duration: "3:00", number: 2, link: "https://www.youtube.com/embed/j5-yKhDd64s"},
        {title: 'Crash', album: albums[2]._id, duration: "3:52", number: 1, link: "https://www.youtube.com/embed/fp_qAAi-T0E"},
        {title: 'Yeah', album: albums[2]._id, duration: "2:52", number: 2, link: "https://www.youtube.com/embed/GxBSyx85Kp8"},
        {title: 'Without you', album: albums[3]._id, duration: "3:54", number: 1, link: "https://www.youtube.com/embed/jUe8uoKdHao"},
        {title: 'Burn', album: albums[3]._id, duration: "3:54", number: 2, link: "https://www.youtube.com/embed/t5XNWFw5HVw"}
    );


    await connection.close();
};


run().catch(error => {
    console.log('Something went wrong', error);
});