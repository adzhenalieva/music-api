const express = require('express');
const User = require('../models/User');
const config = require('../config');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const nanoid = require('nanoid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPathUsers);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.post('/', upload.single('avatar'), async (req, res) => {
    let avatar;
    if(req.file){
        avatar = req.file.filename
    }
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName,
        avatar: avatar
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

router.post('/facebookLogin', async (req, res) => {
    const inputToken = req.body.accessToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;
    try {
        const response = await axios.get(debugTokenUrl);

        if (response.data.data.error) {
            return res.status(401).send({message: 'Facebook token incorrect'});
        }

        if (req.body.id !== response.data.data.user_id) {
            return res.status(401).send({message: 'Wrong user ID'});
        }

        let user = await User.findOne({facebookId: req.body.id});

        if (!user) {
            user = new User({
                username: req.body.email || req.body.id,
                password: nanoid(),
                facebookId: req.body.id,
                displayName: req.body.name,
                avatar: req.body.picture.data.url
            });
        }

        user.generateToken();
        await user.save();

        return res.send({message: 'Login or register successful', user});
    } catch (error) {
        return res.status(401).send({message: 'Facebook token incorrect'});
    }
});

module.exports = router;