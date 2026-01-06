const express = require('express');
const authRouter =  express.Router();
const {register,login,logout,adminRegister,deleteProfile} = require('../controllers/userAuthent');
const userMiddleware = require("../middleware/userMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware");
const user = require('../models/user');

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile)
const jwt = require('jsonwebtoken');
// Public check endpoint: returns user info when a valid token cookie is present,
// otherwise returns 200 with user: null. This avoids harmless 401s in the browser
// when the client isn't logged in but still checks auth on app load.
authRouter.get('/check', async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(200).json({ user: null });
        }

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY);
        } catch (e) {
            return res.status(200).json({ user: null });
        }

        const User = require('../models/user');
        const user = await User.findById(payload._id).select('firstName emailId role');
        if (!user) return res.status(200).json({ user: null });

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role
        };

        return res.status(200).json({ user: reply });
    } catch (err) {
        console.error('Auth check error:', err);
        return res.status(200).json({ user: null });
    }
});


module.exports = authRouter;
