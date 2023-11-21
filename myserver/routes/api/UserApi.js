const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const twilio = require('twilio');
// const bodyParser = require('body-parser');

//http://localhost:3000/api/user
const userController = require("../../components/user/UserController");

//http://localhost:3000/api/user/login
// api login user 
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userController.login(email, password);
    if (user) {
      // tao token
      const token = jwt.sign({ user }, 'secret', { expiresIn: '1h' });
      const returnData = {
        error: false,
        responseTimestamp: new Date(),
        statusCode: 200,
        data: {
          token: token,
          user: user
        }
      }
      return res.status(200).json(returnData);
    } else {
      return res.status(400).json({ result: false, user: null });
    }
  } catch (error) {
    console.log(error);
    next(error);//danh cho web
    return res.status(500).json({ result: false, message: 'loi he thong' })
  }
});

router.post('/register', async (req, res, next) => {

  try {
    const { email, password, name, address, phoneNumber } = req.body;
    const user = await userController.register(email, password, name, address, phoneNumber);
    if (user) {
      return res.status(200).json({ result: true, user: user });
    } else {
      return res.status(400).json({ result: false, user: null, message: '111' });
    }

  } catch (error) {
    console.log(error);
    next(error);//danh cho web
    return res.status(500).json({ result: false, message: 'loi he thong' });

  }
});

//http://localhost:3000/api/user/send-otp-new
router.post('/send-otp-new', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);

    let subject = "THE FIVE MAN SHOES SHOP RESEND OTP";
    const verifyCode = (Math.floor(Math.random() * 90000) + 10000)
    number = verifyCode;
    console.log("--->", verifyCode)
    console.log('number', number);
    const result = await userController.sendVerifyCodeNew(email, subject, verifyCode);
    return res.status(200).json({ message: "Send Success", result: result });
  } catch (error) {
    console.log("MAIL:" + error)//API
    return res.status(500).json({ result: false, massage: "ERROR Send" })//app
  }
});

// for forgot password
//http://localhost:3000/api/user/send-otp
router.post('/send-otp', async (req, res) => {
  try {
      const { email } = req.body;
      let subject = "THE FIVE MAN SHOES SHOP SEND OTP";
      const verifyCode = (Math.floor(Math.random() * 90000) + 100000)
      number = verifyCode;
      console.log("--->", verifyCode)
      console.log('number', number);
      const result = await userController.sendVerifyCode(email, subject, verifyCode);
      return res.status(200).json({ message: "Send Success", result: result });
  } catch (error) {
      console.log("MAIL:" + error)//API
      return res.status(500).json({ result: false, massage: "ERROR Send" })//app
  }
});

//http://localhost:3000/api/user/change-forgot-password
router.put('/change-forgot-password', [], async (req, res, next) => {
  try {
      const { email, newPassword } = req.body;
      console.log(email, newPassword)
      const user = await userController.changeForgotPassword(email, newPassword);
      console.log(user)
      if (user) {
          res.status(200).json({ result: true, message: "Change Forgot Password Success" })
      } else {
          res.status(400).json({ result: false, massage: "Change Forgot Password Failed" })
      }
  } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


//confirmOTP
//http://localhost:3000/api/user/confirm-otp
router.post('/confirm-otp', async (req, res) => {
  try {
      const { email, verifyCode } = req.body;
      const result = await userController.verifyCode(email, verifyCode);
      console.log(result)
      if (result) {
          return res.status(200).json({ result: true, message: "Verify Success" });
      } else {
          return res.status(400).json({ result: false, message: "Verify Failed" });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({ result: false, message: "Verify Failed" });
  }
});

module.exports = router;
