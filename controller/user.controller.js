const userService = require("../services/user.service");

exports.registerUser = async (req, res) => {
    try {
        let userData = await userService.registerUser(req);
        if (userData.status == -1) {
            throw new Error(userData.message);
        }else if (userData.status == 0) {
            return res.status(403).json({ message: userData.message });
        } else {
            let validTo = '2 days';
            let user = await userService.saveToken(userData.data, validTo);
            if (user.status == -1) {
                throw new Error(user.message);
            }
            if (user.status == 0) {
                return res.status(403).json({ message: user.message });
            }
            res.status(200).json({ response: user.data, messsage: "User registered sucessfully" });
        }
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
      let userRegisterData = await userService.loginUser(req.body);
      if (userRegisterData.status == 1) {
        res.status(200).json({
          message: userRegisterData.message,
          data: userRegisterData?.data
        })
      } else {
        res.status(400).json({
          message: userRegisterData.message,
          data: userRegisterData?.data
        })
      }
  
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}

exports.placeOrder = async (req, res) => {
  try {
    let data = await userService.placeOrder(req.userData, req.body);
    if (data && data.status == 0) {
      res.status(403).json({
        message: data.message,
        response: data.response ? data.response : {},
        success: false
      });
      return
    }
    res.status(200).json({
      message: data.message,
      response: data.response,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message, err: error });
  }
};

exports.cancelOrder = async (req, res) => {
    try {
      let data = await userService.cancelOrder(req.userData, req.body);
      if (data && data.status == 0) {
        res.status(403).json({
          message: data.message,
          response: data.response ? data.response : {},
          success: false
        });
        return
      }
      res.status(200).json({
        message: data.message,
        success: true
      });
    } catch (error) {
      res.status(500).json({ message: error.message, err: error });
    }
  };

  exports.orderList = async (req, res) => {
    try {
      let data = await userService.orderList(req.userData);
      if (data && data.status == 0) {
        res.status(403).json({
          message: data.message,
          response: data.response ? data.response : {},
          success: false
        });
        return
      }
      res.status(200).json({
        message: data.message,
        response: data.response,
        success: true
      });
    } catch (error) {
      res.status(500).json({ message: error.message, err: error });
    }
  };