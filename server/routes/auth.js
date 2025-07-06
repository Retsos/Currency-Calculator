const express = require('express');
const router = express.Router();
const { Admin } = require('../models/admin');
const bcrypt = require('bcrypt');
const {protect} = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (username && (await bcrypt.compare(password, admin.password))) {
        res.json({
            username: admin.username,
            token: admin.generateAuthToken()
        })
    }
    else {
        res.status(400).json({ message: 'Invalid username or password' });
    }

});


router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) { //elegxw gia ta swsta fields 
        return res.status(400).json({ message: 'All fields are required' });
    }

    const adminExists = await Admin.findOne({ username });
    // kanw elegxw me to vasi to username prepei na einai monadiko 
    if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists' });
    }
    //φτιαχνω τον admin --> den kanw hash password edw pera alla sto model 
    const admin = new Admin({
        username,
        password,
    });

    try { // apothikeuw to admin sti vasi 
        const savedAdmin = await admin.save();
        res.status(201).json({
            username: savedAdmin.username, //epistrefw to username
            token: savedAdmin.generateAuthToken() //epistrefw to token
        });
    } catch (err) {
        return res.status(400).json({ message: 'Invalid user data' });
    }
});


router.get('/isAuth',protect,async (req, res) =>{
    res.status(200).json({ success: true, username: req.Admin.username });

})

module.exports = router; 
