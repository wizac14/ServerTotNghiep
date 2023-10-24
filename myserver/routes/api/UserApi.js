const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const twilio = require('twilio');
const bodyParser = require('body-parser');

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

router.post('/sendOTP', async (req, res, next) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.findOneAndUpdate({ phone: req.body.phone }, { otp }, { new: true, upsert: true });
  client.messages.create({
    body: `Your OTP is ${otp}`,
    to: user.phone,
    from: 'your_twilio_phone_number'
  });
  res.send({ success: true });
});

module.exports = router;
