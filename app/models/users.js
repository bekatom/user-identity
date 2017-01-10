/**
 * Created by Nika on 25/12/2014.
 */

var mongoose = require('mongoose')

// define the schema for our user model
var userSchema = mongoose.Schema({
    fullName: String,
    avatar: String,
    defaultLanguage: String,
    timeZone: String,
    email: String,
    local: {
        email: {
            type: String,
            unique: true,
            sparse: true
        },
        password: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    linkedin: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    github: {
        id: String,
        token: String,
        email: String,
        name: String
    }
})

userSchema.virtual('anyEmail').get(function() {
    if (this.local.email)
        return this.local.email
    else if (this.facebook.email)
        return this.facebook.email
    else
        return ""
})

// generating a hash
userSchema.methods.generateHash = function(password) {
    var bcrypt = require('bcrypt-nodejs')
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    var bcrypt = require('bcrypt-nodejs')
    return bcrypt.compareSync(password, this.local.password)
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema)
