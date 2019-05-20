const path = require('path');

const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPathAlbum: path.join(rootPath, 'public/uploads/albums'),
    uploadPathArtist: path.join(rootPath, 'public/uploads/artists'),
    uploadPathUsers: path.join(rootPath, 'public/uploads/users'),
    dbURL: 'mongodb://localhost/music',
    mongoOptions: {
        useNewUrlParser: true,
        useCreateIndex: true
    },
    facebook: {
        appId: '368066730491380',
        appSecret: '888709fea656b11f669e1b6613ec5361' // insecure
    }
};

