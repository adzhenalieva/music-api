const path = require('path');

const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPathAlbum: path.join(rootPath, 'public/uploads/albums'),
    uploadPathArtist: path.join(rootPath, 'public/uploads/artists'),
    dbURL: 'mongodb://localhost/music',
    mongoOptions: {
        useNewUrlParser: true,
        useCreateIndex: true
    }
};

