const mongoose = require('mongoose');
const nanoid  = require('nanoid');
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
    const users = await User.create(
        {username: 'admin', password: '123', role: 'admin', token: nanoid()},
        {username: 'leo', password: '123', role: 'user', token: nanoid()}

    );

    const artists = await Artist.create(
        {artist: 'Eminem', info: 'rapper', image: 'eminem.jpeg', user: users[1], published: true},
        {artist: 'Usher', info: 'rnb', image: 'usher.jpeg', user: users[1], published: true},
        {artist: 'Mirbek Atabekov', info: 'rnb', image: 'mirbek.jpg', user: users[1], published: true}
    );

    const albums = await Album.create(
        {title: '8 mile', year: 2010, artist: artists[0]._id, image: 'eminemAlbum.jpeg', user: users[1], published: true},
        {title: 'Eminem show', year: 2008, artist: artists[0]._id, image: 'eminemAlbum2.jpeg', user: users[1], published: true},
        {title: 'Yeah', year: 2011, artist: artists[1]._id, image: 'usherAlbum.jpg', user: users[1], published: true},
        {title: 'Usher show', year: 2008, artist: artists[1]._id, image: 'usherAlbum2.jpeg', user: users[1], published: true},
        {title: 'Muras', year: 2018, artist: artists[2]._id, image: 'mirbekAlbum.jpeg', user: users[1], published: true}
    );

    await Track.create(
        {title: 'Lose yourself', album: albums[0]._id, duration: "3:52", number: 1, link: "https://www.youtube.com/embed/_Yhyp-_hX2s", user: users[1], published: true},
        {title: 'Love the way you lie', album: albums[0]._id, duration: "3:23", number: 2, link: "https://www.youtube.com/embed/uelHwf8o7_U", user: users[1], published: true},
        {title: 'Stan', album: albums[1]._id, duration: "3:45", number: 1, link: "https://www.youtube.com/embed/gOMhN-hfMtY", user: users[1], published: true},
        {title: 'Not afraid', album: albums[1]._id, duration: "3:00", number: 2, link: "https://www.youtube.com/embed/j5-yKhDd64s", user: users[1], published: true},
        {title: 'Crash', album: albums[2]._id, duration: "3:52", number: 1, link: "https://www.youtube.com/embed/fp_qAAi-T0E", user: users[1], published: true},
        {title: 'Yeah', album: albums[2]._id, duration: "2:52", number: 2, link: "https://www.youtube.com/embed/GxBSyx85Kp8", user: users[1], published: true},
        {title: 'Without you', album: albums[3]._id, duration: "3:54", number: 1, link: "https://www.youtube.com/embed/jUe8uoKdHao", user: users[1], published: true},
        {title: 'Burn', album: albums[3]._id, duration: "3:54", number: 2, link: "https://www.youtube.com/embed/t5XNWFw5HVw", user: users[1], published: true},
        {title: 'Muras', album: albums[4]._id, duration: "3:52", number: 1, link: "https://www.youtube.com/watch?v=7ALPIons9NU", user: users[1], published: true},
        {title: 'Seni suiom', album: albums[4]._id, duration: "3:14", number: 2, link: "https://www.youtube.com/watch?v=kde1Vch0NZ8", user: users[1], published: true}
    );


    await connection.close();
};


run().catch(error => {
    console.log('Something went wrong', error);
});