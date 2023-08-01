const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const authentication = require("../middlewares/authentication");
const config = require("../config/config");
const mongoose = require("mongoose");
const utils = require("../modules/utils");
const { OrderModel } = require('../models/orderModel');
const { BookModel } = require('../models/bookModel');
const generateUniqueId = require('generate-unique-id');


  exports.registerUser = async (req) => {
  
    try {
      let data = req.body;
      
      if (!data.email || data.email == '')
        return {
          status: 0,
          message: "Please enter the email address"
        };
  
      if (!data.mobile_number || data.mobile_number == '') {
        return {
          status: 0,
          message: "Please enter the mobile number"
        }
      }
      if (!data.country_code || data.country_code == '') {
        return {
          status: 0,
          message: "Please enter the country code"
        }
      }

      if (!data.password || data.password == '') {
        return {
          status: 0,
          message: "Please enter the password"
        }
      }
  
      data.mobile_number = data.mobile_number;
      let password = await utils.encryptText(data.password);
      
      if (
        !data.country_code ||
        data.country_code == null ||
        data.country_code == "NA" ||
        data.country_code == undefined
      )
        return {
          status: 0,
          message: "Country code is required"
        };
      //check if given number is already exist
        let isMobileExist = await UserModel.findOne({email: data.email }).lean();
        if(!isMobileExist){
          isMobileExist = await UserModel.findOne({
                $and: [{
                  country_code: data.country_code
                }, {
                  mobile_number: data.mobile_number
                }]
            }).lean();
        }
        if (isMobileExist) {
            if ((isMobileExist.mobile_number.toLowerCase() == data.mobile_number.toLowerCase()) && (isMobileExist.country_code == data.country_code))
            return {
                status: 0,
                message: "Provided mobile number is already registered with us"
            };
            if (isMobileExist.email.toLowerCase() == data.email.toLowerCase())
            return {
                status: 0,
                message: "Provided email id is already registered with us"
            };
        }

        let dataToSave = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          country_code: data.country_code,
          mobile_number: data.mobile_number,
          password: password,
          earned_points: 100
        }
        let res = new UserModel(Object.assign({}, dataToSave));
        let result = await res.save();
            return {
              status: 1,
              data: result
            };
          
    } catch (error) {
      throw new Error(error.message);
    }
};

exports.saveToken = async (data, days) => {
    try {
        data.access_token = authentication.generateToken(days);
        let userData = await data.save();
        
        if (!userData) {
            return {
            status: 0,
            message: "Something went wrong"
            };
        } else {
            return {
            status: 1,
            data: Object.assign({}, JSON.parse(JSON.stringify(userData))),
            message: "User Found"
            };
        }
    } catch (error) {
      throw new Error(error.message);
    }
};
  

exports.loginUser = async (data) => {
  try {
    let token = authentication.generateToken();

    const checkExist = await UserModel.findOne({ $or:[{
      country_code: data.country_code,
      mobile_number: data.mobile_number,
    },{email: data.email}]});

    if (checkExist) {
      if (!checkExist.password) {
        return {
          status: -1,
          message: "First Create your password",
          data: {}
        }
      }
      let validPassword = await bcrypt.compare(
        data.password,
        checkExist.password
      );

      if (!validPassword) {
        console.log("checkExist", validPassword);
        return {
          status: -1,
          message: "Please enter the correct password.",
          data: {}
        };
      }

      checkExist.access_token = token;

      let user1 = checkExist;
      let saveUser = await user1.save();
      if (!saveUser) {
        return {
          status: -1,
          message: "Something sent wrong",
          data: {}
        };
      }

      return {
        status: 1,
        data: checkExist,
        message: "Login Success ",
      };
    } else {
      return {
        status: -1,
        message: "User does not exist",
        data: {}
      };
    }
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

exports.placeOrder = async (user, data) => {
  try {
    let { book_id} = data;
    
    let unique_booking_id = (generateUniqueId({ length: 7, useLetters: true }).toUpperCase());
      let bookData = await BookModel.findOne({ _id: (book_id) }).lean();
      if (!bookData) {
        return {
          status: 0,
          message: "Invalid book details"
        }
      }

      let discount_amount = ((bookData.discount_percent * bookData.price) / 100).toFixed(2);
      
      let totalAmount = (parseFloat(bookData.price) - parseFloat(discount_amount)).toFixed(2);
      if(parseFloat(totalAmount) > parseFloat(user.earned_points)){
        return {
          status: 0,
          message: "You don't have enough points to purchase book",
          response: { available_points: user.earned_points }
        }
      }
      let dataToSave = {
        user: user._id,
        book_id: book_id,
        quantity: 1,
        order_id: unique_booking_id,
        currency: "USD",
        total_amount: parseFloat(totalAmount),
        discount_amount: parseFloat(discount_amount),
        order_status: 1,
        payment_status: 1,
        created_at: new Date().getTime(),
      }

      let res = new OrderModel(Object.assign({}, dataToSave));
      let saveOrder = await res.save();
      if (!saveOrder) {
        return {
          status: 0,
          message: "Unable to place order"
        }
      }

      let dataToSend = {
        bookingId: unique_booking_id
      }
      return { message: "Order placed successfully", status: 1, response: dataToSend };

  } catch (error) {
    throw new Error(error.message);
  }
};


exports.cancelOrder = async (user, data) => {
  try {
    if (!user || user._id == '')
      return { status: 0, message: "Login first to cancel order" };
    if (!data || data.order_id == '')
      return { status: 0, message: "Order id is required" };

    let orderDetails = await OrderModel.findOne({ _id: (data.order_id) }).lean();
    if (!orderDetails) {
      return {
        status: 0,
        message: "Order does not exists"
      }
    }

    let updateOrder = await OrderModel.findOneAndUpdate({ _id: (data.order_id) }, { $set: { order_status: 5, cancel_reason: data.cancel_reason, modified_at: new Date().getTime() } }, { new: true }).lean();
    
    return { message: "Order cancelled successfully", status: 1 };
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.orderList = async (user, data) => {
  try {
   
    let orders = await OrderModel.find({ user: user._id }).populate('book_id').lean();

    let dataToSend = {
      orderList: orders || []
    }

    return { message: "Order list fetched successfully", status: 1,  response: dataToSend };
  } catch (err) {
    throw new Error(err.message);
  }
};