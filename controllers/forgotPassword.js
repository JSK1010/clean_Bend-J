const Cred_vit = require("../models/creds");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();

exports.forgotPassword = async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    try {
        const user = await Cred_vit.findOne({ email });

        if(!user) return res.status(400).json({ message: "User does not exist" });

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Set the new password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'New password set' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};