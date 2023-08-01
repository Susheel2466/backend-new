const { conn, mongoose } = require("../config/db");
const generateUniqueId = require('generate-unique-id');

const orderSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'user',
        default:null
    },
    book_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref :'book',
        default:null
    },
    quantity: {
        type: Number,
        default: 1
    },
    order_id: {
        type: String,
        default: generateUniqueId({
            length: 7,
            useLetters: true
        }).toUpperCase()
    },
    currency:{
        type:String,
        default: null
    },
    total_amount:{
        type:Number,
        default:0
    },
    discount_amount:{
        type:Number,
        default:0
    },
    order_status:{
        type:Number,
        default:0   // 1 for  placed, 2 packed , 3 dispached , 4 delivered , 5 user cancel
    },
    payment_status:{
        type:Number,
        default:0   // 0 for pending , 1 for complete , 2 failed 
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    cancel_reason: {
        type: String
    },
    modified_at: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: 'order',
    versionKey: false
});

exports.OrderModel = mongoose.model('order', orderSchema)