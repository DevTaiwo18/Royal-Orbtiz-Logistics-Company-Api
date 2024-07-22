const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff',
    },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
