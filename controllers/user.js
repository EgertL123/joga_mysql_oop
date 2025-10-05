const bcrypt = require('bcrypt');
const userDbModel = require('../models/user');
const userModel = new userDbModel();

class userController {

    async register (req, res) {
        const { username, email, password, role = 'user' } = req.body;
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


    async login(req, res) {
        try {
            const user = await userModel.findOne(req.body.username);
            if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
                return res.status(401).json({
                    message: 'Invalid username or password!'
                });
            }

            req.session.user = {
                username: user.username,
                user_id: user.id,
                role: user.role
            };

            res.json({
                message: 'User is logged in',
                user: req.session.user
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    async logout(req, res) {
        try {
            console.log(req.session);
            if (!req.session) {
                return res.status(200).json({
                    message: 'User is not logged in'
                });
            }
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Could not log out. Please try again.' });
                }
                res.json({ message: 'User is logged out' });
            });
            console.log(req.session);
        }   catch (error) {
            res.json({ message: 'Internal server error' });
        }
    }

    async adminOnly(req, res) {
        if (req.session.user && req.session.user.role === 'admin') {
            res.json({ message: 'Welcome, Admin!' });
        } else {
            res.status(403).json({ message: 'Access denied.' });
        }
    }

}

module.exports = new userController;