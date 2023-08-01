const mongoose = require('mongoose');
 
const conn = mongoose.connect('mongodb+srv://Susheel:Susheel321@shoppingcart.zr9jv.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

if (conn){
    console.log('Mongodb connected successfully.');
}

exports.mongoose = mongoose;
exports.conn = conn;
