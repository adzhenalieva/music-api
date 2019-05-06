const express = require('express');
const Track = require('../models/Track');
const auth = require('../middleware/auth');
const permit = require('../middleware/permit');
const check = require('../middleware/check');

const router = express.Router();

router.get('/', check, (req, res) => {
    let criteria = {published: true};
    if (req.query.album) {
        criteria = {
            album: req.query.album,
            published: true
        }
    }
    if (req.user && req.query.album) {
        criteria = {
            album: req.query.album,
            $or: [
                {published: true},
                {user: req.user._id}
            ]
        }
    }
    Track.find(criteria).populate('album')
        .then(tracks => {
            res.send(tracks)
        }).catch(() => res.sendStatus(500))

});

router.get('/admin', [auth, permit('admin')], (req, res) => {
    Track.find().populate('album')
        .then(tracks => {
            res.send(tracks)
        }).catch(() => res.sendStatus(500))

});

router.get('/:id', (req, res) => {
    Track.findById(req.params.id)
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404)
        })
        .catch(() => res.sendStatus(500));
});

router.post('/', auth, async (req, res) => {
    const number = await Track.find({album: req.body.album});
    const track = await new Track({
        title: req.body.title,
        user: req.user.id,
        number: number.length + 1,
        link: req.body.link,
        duration: req.body.duration,
        album: req.body.album
    });
    track.save()
        .then(result => res.send(result))
        .catch(error => res.status(500).send(error));
});


router.put('/:id/toggle_published', [auth, permit('admin')], async (req, res) => {
    const track = await Track.findById(req.params.id);
    if (!track) {
        return res.sendStatus(404);
    }
    track.published = !track.published;

    await track.save()
        .then(() => res.send({message: 'success'}))
        .catch(() => res.sendStatus(500).send(error))
});


router.delete('/:id/delete', [auth, permit('admin')], (req, res) => {
    Track.findByIdAndDelete(req.params.id)
        .then(() => res.send({message: 'success'}))
        .catch(() => res.sendStatus(500).send(error))
});

module.exports = router;