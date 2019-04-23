const express = require('express');
const TrackHistory = require('../models/TrackHistory');
const User = require("../models/User");

const router = express.Router();


router.post('/', async (req, res) => {
    const token = req.get("Token");

    if (!token) {
        return res.status(401).send({error: 'Token headers not present'})
    }
    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'Token incorrect'})
    }

    const trackHistory  = new TrackHistory({
        user: user._id,
        track: req.body.track,
        datetime: new Date().toISOString()
    });

    trackHistory.save()
        .then((result) => res.send(result))
        .catch(e => res.status(500).send(e))
});


module.exports = router;