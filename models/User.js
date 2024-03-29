const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,'Please enter an email'],
        unique: true,
        lowercase: true,
        validate:[isEmail,'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true,'Please enter an password'],
        minlength: [6,'Minimum password length is 6 characters']
    }
});

//fire a function after doc save to db
UserSchema.post('save',function(doc,next){
    console.log('new user was created & Saved',doc)
    next();
})

// fire a function before doc save to db
UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    console.log('User about to be created & saved',this);
    next();
})

UserSchema.statics.login = async function(email,password) {
    const user = await User.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect Password')
    }
    throw Error('incorrect Email');
}   

const User = mongoose.model('user', UserSchema);

module.exports = User;