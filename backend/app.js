// const bcrypt = require('bcryptjs');
const joi = require('joi');
const dotenv = require('dotenv');
const { v4 } = require('uuid');
const models = require('./models');
const { debitAccount, creditAccount } = require('./helpers/transactions');

/**
 * @param {number} sender_id account_id of the sender
 * @param {number} recipient_id account_id of the recipient
 * @param {number} amount amount to deposit
 */
async function transfer(sender_id, recipient_id, amount) {
  const t = await models.sequelize.transaction();
  try {
    const reference = v4();
    const purpose = 'transfer';

    const transferResult = await Promise.all([
      debitAccount({
        amount,
        account_id: sender_id,
        purpose,
        reference,
        metadata: {
          recipient_id,
        },
        t,
      }),
      creditAccount({
        amount,
        account_id: recipient_id,
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
      return transferResult;
    }

    await t.commit();
    return {
      success: true,
      message: 'transfer successful',
    };
  } catch (error) {
    await t.rollback();
    return {
      success: false,
      error: 'internal server error',
    };
  }
}

module.exports = {
  transfer,
};
