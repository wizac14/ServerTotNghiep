const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const upload=require('../../middle/UploadImg');
//http://localhost:3000/api/user
const userController = require("../../components/user/UserController");
//http://localhost:3000/api/user/login
// api login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userController.login(email, password);
    if (user) {
      // tao token
      const token = jwt.sign({ user }, "secret", { expiresIn: "1h" });
      const returnData = {
        error: false,
        responseTimestamp: new Date(),
        statusCode: 200,
        data: {
          token: token,
          user: user,
        },
      };
      return res.status(200).json(returnData);
    } else {
      return res.status(400).json({ result: false, user: null });
    }
  } catch (error) {
    console.log(error);
    next(error); //danh cho web
    return res.status(500).json({ result: false, message: "loi he thong" });
  }
});
//http://localhost:3000/api/user/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, address, phoneNumber } = req.body;
    const user = await userController.register(
      email,
      password,
      name,
      address,
      phoneNumber
    );
    if (user) {
      return res.status(200).json({ result: true, user: user });
    } else {
      return res
        .status(400)
        .json({ result: false, user: null, message: "111" });
    }
  } catch (error) {
    console.log(error);
    next(error); //danh cho web
    return res.status(500).json({ result: false, message: "loi he thong" });
  }
});
//http://localhost:3000/api/user/update
router.post('/update', async (req, res, next) => {

  try {
      const { name, email, password, address,phoneNumber, gender, dob,image } = req.body;
      // console.log(email, password, name, description,gender, dob, avatar, role, createAt, updateAt, isLogin);

      const user = await userController.updateUser(name, email, password, address,phoneNumber, gender,dob, image);
      // console.log(user)
      if (user) {
          return res.status(200).json({ result: true, user: user, message: "Update Success" })
      } else {
          return res.status(400).json({ result: false, user: null, message: " user not exist" })
      }
  } catch (error) {
      console.log(error)
      return res.status(500).json({ result: false, user: null })
  }
});
//http://localhost:3000/api/user/upload-image
router.post('/upload-image', [upload.single('image')], async (req, res, next) => {
  try {
      const { file } = req;
      if (file) {
          const link =`http://192.168.0.105:3000/images/${file.filename}`;
          return res.status(200).json({ result: true, link: link });
      }

      return res.status(400).json({ result: true, link: null });
  } catch (error) {
      console.log("Edit new product error: ", error);
      return res.status(500).json({ result: false });
  }
});
module.exports = router;
