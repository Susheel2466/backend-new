const { BookModel } = require("../models/bookModel");
  
  exports.insertBook = async (req) => {
  
    try {
      let { book_name, book_author, book_image, discount_percent, price, tags } = req.body;
      
      if (!book_name || book_name == '')
        return {
          status: 0,
          message: "Please enter the book name"
        };

      if (!book_author || book_author == '')
        return {
          status: 0,
          message: "Please enter the book author name"
        };
  
      if (!book_image || book_image == '') {
        return {
          status: 0,
          message: "Please enter the book image"
        }
      }
      if (!price || price == '') {
        return {
          status: 0,
          message: "Please enter the price"
        }
      }

      if (!tags || tags.length == 0) {
        return {
          status: 0,
          message: "Please enter atleast one tag"
        }
      }

        let isBookExist = await BookModel.findOne({book_name: book_name }).lean();
        if(isBookExist){
          return {
            status: 0,
            message: "Provided book already exists with us"
        };
        }

        let dataToSave = {
          book_name,
          book_author,
          book_image,
          discount_percent,
          price,
          tags
        }
        let res = new BookModel(Object.assign({}, dataToSave));
        let result = await res.save();

        return {
          status: 1,
          data: result
        };
          
    } catch (error) {
      throw new Error(error.message);
    }
};

  
exports.getBookList = async () => {
  
  try {    

      let bookList = await BookModel.find({ }).lean();
      
      return {
        status: 1,
        data: bookList || []
      };
        
  } catch (error) {
    throw new Error(error.message);
  }
};