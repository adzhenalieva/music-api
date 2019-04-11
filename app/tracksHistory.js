const express = require('express');
const TrackHistory = require('../models/TrackHistory');
const User = require("../models/User");

const router = express.Router();

router.get('/', (req, res) => {
    TrackHistory.find()
        .then(artists => res.send(artists))
        .catch(() => res.sendStatus(500))
});

router.post('/', async (req, res) => {
    const token = req.get("Token");

    if (!token) {
        return res.status(401).send({error: 'Token headers not present'})
    }
    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'Token incorrect'})
    }

    const trackHistory  = {
        user: user._id,
        track: req.body.track,
        datetime: new Date().toISOString()
    };
    const trackHistory1 = new TrackHistory(trackHistory);
    trackHistory1.save()
        .then((result) => res.send(result))
        .catch(e => res.status(500).send(e))
});


module.exports = router;