const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);
}
module.exports = {
    async signup(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).send({ error: 'You must provide email and password'});
        }
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(422).send({ error: 'Email is in use'});
            }
             user = new User({
                email,
                password
            });
            user = await user.save();

            res.send({ token: tokenForUser(user)});
        } catch (err) {
            next(err);
        }
    },
    async signin(req, res, next) {
        // user have already auth'ed

        res.send({ token: tokenForUser(req.user) });
    }
};
