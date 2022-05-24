const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { v4 } = require('uuid');
const models = require('../models');
const { debitAccount, creditAccount } = require('../helpers/transactions');
const { isAuth } = require('../middleware/auth');
const { chargeCard, chargeBank, withdraw } = require('../flutterwave');

const transactionRouter = express.Router();

transactionRouter.post(
  '/transfer',
  isAuth,

  async (req, res) => {
    const user = await models.User.findOne({
      where: { username: req.user.username },
    });
    const receipient = await models.User.findOne({
      where: { username: req.body.receipient },
    });

    const t = await models.sequelize.transaction();

    try {
      const reference = v4();
      const purpose = 'transfer';

      const debitResult = await debitAccount({
        amount: req.body.amount,
        accountId: user.id,
        purpose,
        reference,
        metadata: {
          reciever: receipient.id,
        },
      });

      if (!debitResult.success) {
        await t.rollback();
        console.log(debitResult);

        return res.status(400).send({
          success: false,
          error: debitResult.error,
        });
      } else {
        const creditResult = await creditAccount({
          amount: req.body.amount,
          accountId: receipient.id,
          purpose,
          reference,
          metadata: {
            sender: user.id,
          },
        });

        if (!creditResult.success) {
          res.send(creditResult);
          await t.rollback();
          console.log(creditResult);
        } else {
          await t.commit();
          res.send({
            success: true,
            message: 'Transfer successful',
          });
        }
      }
    } catch (error) {
      await t.rollback();
      res.send({
        success: false,
        error: error.message,
      });
    }
  }
);

transactionRouter.post(
  '/charge',
  expressAsyncHandler(async (req, res) => {
    chargeCard({
      amount: req.body.amount,

      tag: req.body.tag,
      pan: req.body.pan,
      expiry_month: req.body.expiry_month,
      expiry_year: req.body.expiry_year,
      cvv: req.body.cvv,
      otp: req.body.otp,
      pin: req.body.pin,
    })
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  })
);

transactionRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const transactions = await models.Transaction.findAll({
      where: { AccountId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.send(transactions);
  })
);

transactionRouter.get(
  '/:id',
  isAuth,

  expressAsyncHandler(async (req, res) => {
    const transaction = await models.Transaction.findOne({
      where: { id: req.params.id },
    });

    res.send(transaction);
  })
);

module.exports = transactionRouter;
