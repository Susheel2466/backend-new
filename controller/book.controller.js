const bookService = require("../services/book.services");

exports.insertBook = async (req, res) => {
    try {
        let userData = await bookService.insertBook(req);
        if (userData.status == -1) {
            throw new Error(userData.message);
        }else if (userData.status == 0) {
            return res.status(403).json({ message: userData.message });
        } else {
            
            res.status(200).json({ response: userData.data, messsage: "Book inserted successfully" });
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

exports.getBookList = async (req, res) => {
    try {
        let userData = await bookService.getBookList();
        if (userData.status == -1) {
            throw new Error(userData.message);
        }else if (userData.status == 0) {
            return res.status(403).json({ message: userData.message });
        } else {
            
            res.status(200).json({ response: userData.data, messsage: "Book list fetched successfully" });
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};
