const jwt = require('jsonwebtoken'); // used to create, signIn & Verify tokens
const config = require('../config/config'); //require for config files
const { UserModel } = require('../models/userModel');

exports.verifyUserToken = async (req, res, next) => {

    let { access_token } = req.headers;
    if (!access_token)
        return res.status(401).send({
            auth: false,
            message: 'No token Provided'
        });

    jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function (err, decoded) {
        if (!err) {
            let user = await UserModel.findOne({ access_token: access_token })
            if (!user) {
                res.status(401).json({ message: "Invalid access_token" });
                return;
            }
            req.userData = user;
            next();
        } else {
            return res.status(401).json({ auth: false, message: 'Token has been expired' });
        }
    })
}


exports.generateToken = () => {
    let token = jwt.sign({ access: 'access-' }, config.JWT_PRIVATE_KEY, { expiresIn: '2 days' });
    // let token = jwt.sign({ access: 'access-' }, config.JWT_PRIVATE_KEY, {});
    return token;
}