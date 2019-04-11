const express = require('express');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const nanoid = require('nanoid');

const router = express.Router();

router.get('/:token', (req, res) => {
    User.findOne({token: req.param.token})
        .then(result => res.json(result._id))
        .catch(error => res.sendStatus(401).send(error))
});

router.post('/', (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(user => res.send(user))
        .catch(error => res.status(400).send(error));
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(400).send({error: 'Username not found'});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
        return res.status(400).send({error: 'Password is wrong'});
    }
    user.token = nanoid();
    res.send({token: user.token});
});


module.exports = router;