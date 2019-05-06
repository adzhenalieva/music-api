const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');

const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const check = require('../middleware/check');

const Artists = require('../models/Artist');

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

router.get('/', check, (req, res) => {
    let criteria = {published: true};
    if (req.user) {
        criteria = {
            $or: [
                {published: true},
                {user: req.user._id}
            ]
        }
    }
    if(req.user && req.user.role === 'admin'){
        criteria = null;
    }
    Artists.find(criteria).sort({artist: 1})
        .then(artists => res.send(artists))
        .catch(() => res.sendStatus(500))
});

router.get('/admin', [auth, permit('admin')], (req, res) => {
    Artists.find().sort({artist: 1})
        .then(artists => res.send(artists))
        .catch(() => res.sendStatus(500))
});

router.get('/:id', (req, res) => {
    Artists.findById(req.params.id)
        .then(artist => res.send(artist))
        .catch(() => res.sendStatus(500))
});

router.post('/', auth, upload.single('image'), async (req, res) => {
    const artistData = req.body;
    if (req.file) {
        artistData.image = req.file.filename;
    }
    artistData.user = req.user._id;
    const artist = await new Artists(artistData);
    artist.save()
        .then(result => res.send(result))
        .catch(() => res.sendStatus(400).send(error))
});

router.put('/:id/toggle_published', [auth, permit('admin')], async (req, res) => {
    const artist = await Artists.findById(req.params.id);
    if (!artist) {
        return res.sendStatus(404);
    }
    artist.published = !artist.published;

   await  artist.save()
        .then(() => res.send({message: 'success'}))
        .catch(() => res.sendStatus(500).send(error))
});

router.delete('/:id/delete',  [auth, permit('admin')], async (req, res) => {
    Artists.findByIdAndDelete(req.params.id)
        .then(() => res.send({message: 'success'}))
        .catch(() => res.sendStatus(500).send(error))
});

module.exports = router;