const bcrypt = require('bcrypt');
const userDbModel = require('../models/user');
const userModel = new userDbModel();

class userController {

    async register (req, res) {
        const existingUser = await userModel.findOne(req.body.username);
        if(existingUser) {
            return res.status(400).json({
            message: 'Username already exists'
        });
        }

        if(req.body.password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }
        const cryptPassword = await bcrypt.hash(req.body.password, 10);
        const registeredId = await userModel.create({
            username: req.body.username,
            email: req.body.email,
            password: cryptPassword
        });

        if(registeredId) {
            const userData = await userModel.findById(registeredId);
            req.session.user = {
                username: userData.username,
                user_id: userData.id
            }
            res.json ({
                message: 'User registered successfully',
                user_session: req.session.user
            })
        }
    }
}

module.exports = new userController;