const express = require('express');
const User = require('../models/User');


const router = express.Router();


router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    user.generateToken();

    try {
        await user.save();
        return res.send({message: "success", user})
    } catch (error) {
        return res.status(400).send(error)
    }
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(400).send({error: 'Username/password incorrect'})
    }

    const isMatch = user.checkPassword(req.body.password);

    if (!isMatch) {
        return res.status(400).send({error: 'Username/password incorrect'})
    }

    user.generateToken();

    await user.save();

    res.send({message: "Login success", user})
});


router.delete('/sessions', async (req, res) => {
    const token = req.get('Authorization');
    const success = {message: 'Success'};

    if (!token) {
        return res.send(success);
    }
    const user = await User.findOne({token});

    if (!user) {
        return res.send(success);
    }

    user.generateToken();
    user.save();

    return res.send(success);
});

module.exports = router;