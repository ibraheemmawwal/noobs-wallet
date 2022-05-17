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
  // isAuth,
  async (req, res) => {
    const { sender_tag, recipient_tag, amount } = req.body;
    const sender = await models.User.findOne({
      where: { username: sender_tag },
    });
    const recipient = await models.User.findOne({
      where: { username: recipient_tag },
    });
    if (!sender || !recipient) {
      return res.status(400).json({
        success: false,
        error: 'User does not exist',
      });
    }

    const t = await models.sequelize.transaction();

    try {
      const reference = v4();
      const purpose = 'transfer';

      const transferResult = await Promise.all([
        await debitAccount({
          amount,
          accountId: sender.id,
          purpose,
          reference,
          metadata: {
            recipient_id,
          },
        }),
        await creditAccount({
          amount,
          accountId: recipient.id,
          purpose,
          reference,
          metadata: {
            sender_id,
          },
        }),
      ]);

      const failedTxns = transferResult.filter((result) => !result.success);
      if (failedTxns.length) {
        await t.rollback();
        res.send(transferResult);
      }
      console.log('transferResult', transferResult);

      await t.commit();
      res.status(200).send({
        success: true,
        message: 'Transfer successful',
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      // await t.commit();
      res.status(500).send({
        success: false,
        message: 'Transfer failed',
      });
    }
  }
);

module.exports = transactionRouter;
