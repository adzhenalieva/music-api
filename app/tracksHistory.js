const express = require('express');
const TrackHistory = require('../models/TrackHistory');
const Album = require('../models/Album');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', auth, async (req, res) => {
    await TrackHistory.find({user: req.user._id}).populate({path: 'track', populate: {path: 'album', populate: {path: 'artist'}}}).sort({datetime: -1})
        .then(results => res.send(results))
        .catch(() => res.sendStatus(500))

});


router.post('/', auth, (req, res) => {

    const trackHistory = new TrackHistory({
        user: req.user._id,
        track: req.body.track,
        datetime: new Date().toISOString()
    });

    trackHistory.save()
        .then((result) => res.send(result))
        .catch(e => res.status(500).send(e))
});


module.exports = router;