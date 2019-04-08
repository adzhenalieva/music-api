const express = require('express');

const Track = require('../models/Track');


const router = express.Router();

router.get('/', (req, res) => {
    if (req.query.album) {
        Track.find({album: req.query.album})
            .then(result => {
                if (result) return res.send(result);
                res.sendStatus(404)
            })
            .catch(() => res.sendStatus(500));
    } else {
        Track.find()
            .then(tracks => {
                res.send(tracks)
            }).catch(() => res.sendStatus(500))
    }
});

router.get('/:id', (req, res) => {
    Track.findById(req.params.id)
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404)
        })
        .catch(() => res.sendStatus(500));
});

router.post('/', (req, res) => {
    const track = new Track(req.body);
    track.save()
        .then(result => res.send(result))
        .catch(error => res.sendStatus(400).send(error));
});




module.exports = router;