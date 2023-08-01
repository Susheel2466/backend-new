var { mongoose, conn } = require('../config/db');

const userSchema = new mongoose.Schema({
   
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: null
    },
    country_code: {
        type: String,
        default: null
    },
    mobile_number: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: ''
    },
    access_token: {
        type: String,
        default: ''
    },
    earned_points:{
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    last_login:{
        type: Number,
        default: Date.now()
    }
},
    {
        strict: true,
        collection: 'user',
        versionKey: false,
    }
);

exports.UserModel = mongoose.model('user', userSchema);
