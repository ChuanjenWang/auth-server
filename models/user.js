const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define our module 
const userSchema = new Schema({
    email: { type: String, lowercase: true, unique: true, index: true },
    password: String
});

//On Save Hook, encrypt password
//Before saving a model, run this function
userSchema.pre('save', function(next) {
    const user = this;

    //generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if(err) {return next(err); }

        //hash (encrypt) our passowrd using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) {return next(err); }

            //overwrite plain text password with encrypted passowrd
            user.password = hash;
            next();
        });
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) { return callback(err); }

        callback(null, isMatch);
    });
}

//Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;