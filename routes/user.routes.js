const userController = require('../controller/user.controller');
const user = require("../middlewares/authentication");
const express = require("express");
const app = express();
const route = express.Router();

route.post("/sign_up", userController.registerUser);
route.post("/login", userController.loginUser);
route.post("/place_order", user.verifyUserToken, userController.placeOrder);
route.post("/cancel_order", user.verifyUserToken, userController.cancelOrder);
route.get("/order_list", user.verifyUserToken, userController.orderList);


module.exports = route;