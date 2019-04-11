const express = require('express');
const mongoose = require('mongoose');
const artists = require('./app/artists');
const albums = require('./app/albums');
const tracks = require('./app/tracks.');
const trackHistory = require('./app/tracksHistory');
const users = require('./app/users');
const cors = require('cors');
const config = require('./config');

const app = express();

const port = 8000;
app.use(express.json());
app.use(express.static('public'));
app.use(cors());




mongoose.connect(config.dbURL, config.mongoOptions).then(() => {
    app.use('/artists', artists);
    app.use('/tracks', tracks);
    app.use('/albums', albums);
    app.use('/users', users);
    app.use('/track_history', trackHistory);

    app.listen(port, () => {
        console.log(`Server started on ${port} port`);
    })

});