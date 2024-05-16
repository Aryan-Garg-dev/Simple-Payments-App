const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { CONNECTION_STRING } = require("./config");

mongoose.connect(CONNECTION_STRING);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    name: {
        first: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
        last: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    signInDate: {
        type: Date,
        default: Date.now,
        index: {
            unique: true,
        }
    }
})

userSchema.methods.createHash = async function (plainTextPassword){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainTextPassword, salt);
}

userSchema.methods.validatePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})


const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User, Account
}