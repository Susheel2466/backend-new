var { mongoose, conn } = require('../config/db');

const bookSchema = new mongoose.Schema({
    book_name: {
        type: String,
        default: ''
    },
    book_author: {
        type: String,
        default: ''
    },
    book_image: {
        type: String,
        default: ''
    },
    discount_percent: {
        type: Number,
        default: 0
    },  
    price: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    tags: [{
        type: String,
    }]
},
    {
        strict: true,
        collection: 'book',
        versionKey: false,
    }
);

exports.BookModel = mongoose.model('book', bookSchema);
