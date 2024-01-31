const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
 const bcrypt = require('bcrypt');

exports.CreateLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(400).json({ error: 'User Not Found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600000 }, (err, token) => {
            if (err) throw err;
            return res.status(200).json({
                token,
                message: 'Login Successful'
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};
