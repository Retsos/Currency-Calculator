const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const  passwordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({  //μοντελο admin 
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

adminSchema.pre('save', async function(next) { //pre save -> trexei prin tin dimiourgia antikeimenou sti vasi
    if(!this.isModified('password')) { //an to password einai hashed tote proxwrame 
        return next();
    }
    const salt = await bcrypt.genSalt(10); //ftiaxnw neo string to 10 simainei to kostos tou hashing oso megalitero toso kalitero+argo
    this.password = await bcrypt.hash(this.password, salt);//antikathista to password me to neo hashed 
    next();
})


adminSchema.methods.generateAuthToken = function() { // ftiaxnw token gia 8 wres 
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{ expiresIn: '8h' }); //kai vazw to id tou admin
    return token;
}

const validate = (data) => {// kanw validate ta data an einai swsta px swsto format etc..
    const schema = Joi.object({
        username: Joi.string().required().label('Username'),
        password: passwordComplexity().required().label('Password') //ελεγχος για το αν το password einai dinato

    })
    return schema.validate(data);
}

const Admin = mongoose.model('Admin', adminSchema);



module.exports = { Admin, validate };