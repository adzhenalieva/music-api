const express = require('express');

const TrackHistory = require('../models/TrackHistory');

const router = express.Router();


router.post('/', (req, res) => {
    const trackHistory = new TrackHistory(req.body);
    let token = req.get('Token');
    if (!token) {
       res.sendStatus(401);
    }
    trackHistory.datetime = Date.now();
    trackHistory.save()
        .then(result => res.send(result))
        .catch(error => res.sendStatus(400).send(error));

});


module.exports = router;