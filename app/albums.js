const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../config');
const nanoid = require('nanoid');
const Album = require('../models/Album');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const check = require('../middleware/check');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPathAlbum);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();


router.get('/', check, (req, res) => {
    let criteria = {published: true};
    if (req.query.artist) {
        criteria = {
            artist: req.query.artist,
            published: true
        }
    }
    if (req.user && req.query.artist) {
        criteria = {
            artist: req.query.artist,
            $or: [
                {published: true},
                {user: req.user._id}
            ]
        }
    }
    Album.find(criteria).sort({year: 1}).populate('artist')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404)
        })
        .catch(error => res.status(500).send(error));

});

router.get('/admin', [auth, permit('admin')], (req, res) => {
    Album.find().sort({year: 1}).populate('artist')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404)
        })
        .catch(error => res.status(500).send(error));

});

router.get('/:id', (req, res) => {
    Album.findById(req.params.id).populate('artist')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404)
        })
        .catch(() => res.sendStatus(500));
});


router.post('/', [auth, permit('user'), upload.single('image')], async (req, res) => {
    const albumData = req.body;
    if (req.file) {
        albumData.image = req.file.filename;
    }
    albumData.user = req.user._id;
    const album = await new Album(albumData);
    album.save()
        .then(result => res.send(result))
        .catch(error => res.status(400).send(error));
});

router.put('/:id/toggle_published', [auth, permit('admin')], async (req, res) => {
    const album = await Album.findById(req.params.id);
    if (!album) {
        return res.sendStatus(404);
    }
    album.published = !album.published;

    await album.save()
        .then(() => res.send({message: 'success'}))
        .catch(() => res.sendStatus(500).send(error))
});

router.delete('/:id/delete', [auth, permit('admin')], async (req, res) => {
    Album.findByIdAndDelete(req.params.id)
        .then(() => res.send({message: 'success'}))
        .catch(() => res.sendStatus(500).send(error))
});


module.exports = router;