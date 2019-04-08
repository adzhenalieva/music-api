const express = require('express');
const multer = require('multer');
const nanoid = require('nanoid');
const Artists = require('../models/Artist');
const config = require("../config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPathArtist);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});


const router = express.Router();

router.get('/', (req, res) => {
    Artists.find()
        .then(artists => res.send(artists))
        .catch(() => res.sendStatus(500))
});

router.post('/', upload.single('image'), (req, res) => {
    const artistData = req.body;
    if (req.file) {
        artistData.image = req.file.filename;
    }
    const artist = new Artists(artistData);
    artist.save()
        .then(result => res.send(result))
        .catch(() => res.sendStatus(400).send(error))
});

module.exports = router;