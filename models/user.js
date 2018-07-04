const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
});
// onSave hook, encrypt password
userSchema.pre('save', function (next) {
   const user = this;
   bcrypt.genSalt(10, function (err, salt) {
       if(err) {
           return next(err);
       }
       bcrypt.hash(user.password, salt, null, function (err, hash) {
           if(err) { return next(err); }
           user.password = hash;
           next();
       })
   })
});
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if(err) { return callback(err); }

        callback(null, isMatch);
    });
}

const user = mongoose.model('user', userSchema);
module.exports = user;