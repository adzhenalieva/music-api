const express = require('express');

const TrackHistory = require('../models/TrackHistory');

const router = express.Router();

router.get('/', (req, res) => {
    TrackHistory.find()
        .then(artists => res.send(artists))
        .catch(() => res.sendStatus(500))
});

router.post('/',  async (req, res) => {
    const trackHistory = new TrackHistory(req.body);
    trackHistory.datetime = Date.now();
    let token = req.get('Token');
    if (!token) {
        res.sendStatus(401);
    }
    trackHistory.user  = await res.redirect('/users/' + token);


    trackHistory.save()
        .then(result => res.send(result))
});


module.exports = router;