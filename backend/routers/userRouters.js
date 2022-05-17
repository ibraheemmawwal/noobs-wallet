const express = require('express');
const bcrypt = require('bcrypt');
const expressAsyncHandler = require('express-async-handler');
const { User, Account } = require('../models');
const { generateToken, isAuth } = require('../middleware/auth');
const otpGenerator = require('otp-generator');
const { sendMail } = require('../services/mail');

const userRouter = express.Router();

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const userExist = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (userExist) {
      return res.status(400).send({
        message: 'User already exist',
      });
    }
    // const usernameExist = await User.findOne({
    //   where: {
    //     username: req.body.username,
    //   },
    // });
    // if (usernameExist) {
    //   return res.status(400).send({
    //     message: 'Username already exist',
    //   });
    // }

    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(OTP);

    await sendMail({
      to: req.body.email,
      OTP: OTP,
    });

    const user = await User.create({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      otp: OTP,
      active: false,
    });

    const createdUser = await user.save();
    const account = await Account.create({
      userId: createdUser.id,
      balance: 0.0,
    });

    const createdAccount = await account.save();

    res.send({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      isAdmin: createdUser.isAdmin,
      active: createdUser.active,
      otp: createdUser.otp,
      balance: createdAccount.balance,
      userId: createdAccount.userId,

      // token: generateToken(createdUser),
    });
  })
);

userRouter.post(
  '/signup/verify',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: {
        otp: req.body.otp,
      },
    });
    if (!user) {
      return res.status(400).send({
        message: 'Invalid OTP',
      });
    }
    user.active = true;
    user.otp = null;
    await user.save();
    res.send({
      message: 'User verified',
      token: generateToken(user),
    });
  })
);

userRouter.post(
  '/signup/verify/resend',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send({
        message: 'User doesnot exist',
      });
    }
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(OTP);

    await sendMail({
      to: req.body.email,
      OTP: OTP,
    });

    user.otp = OTP;
    await user.save();
    res.send({
      message: 'OTP sent',
    });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send({
        message: 'Invalid email or password',
      });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send({
        message: 'Invalid email or password',
      });
    }

    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      active: user.active,
      token: generateToken(user),
    });
  })
);

userRouter.post(
  '/pin',
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).send({
        message: 'Invalid email or password',
      });
    }
    const pin = req.body.pin;

    await user.update({
      pin: pin,
    });
    res.send({
      message: 'Pin updated',
    });
  })
);

userRouter.get(
  '/',

  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      active: user.active,
      balance: user.balance,
    });
  })
);

module.exports = userRouter;
