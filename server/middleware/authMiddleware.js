const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {Admin} = require('../models/admin');

const protect = asyncHandler(async (req, res, next) => {

    let token;
     
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // elegxw gia auth  header kai an jekinaei me bearer 
        try {                                                                           // epeidi to token sta headers stelnetai etsi -> 
                                                                                        // Bearer "fdsnkgfsdns"
            //pairnw to token, afoy einai bearer keno token -> xwrizw me vasi to keno kai exw ena array me 2 stoixeia opoy 0-> bearer 1 -> token 
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //elegxw tin egkyrotita tou token
            req.Admin = await Admin.findById(decoded._id).select('-password'); //alla den kanw hash to password       
            next()      
        }catch (error){
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }                                                                             
    }
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
});

module.exports = { protect };