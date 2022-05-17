const { v4 } = require('uuid');
const models = require('../models');

async function creditAccount({
  amount,
  accountId,
  tag,
  purpose,
  reference = v4(),
  externalReference,
  metadata,
  t,
}) {
  const account = await models.Account.findOne({ where: { id: accountId } });
  if (!account) {
    return {
      success: false,
      error: "Account doesn't exist",
    };
  }

  await models.Account.increment(
    { balance: amount },
    { where: { id: accountId }, transaction: t }
  );

  await models.Transaction.create(
    {
      txnType: 'credit',
      amount,
      accountId,
      purpose,
      reference,
      externalReference,
      balanceBefore: Number(account.balance),
      balanceAfter: Number(account.balance) + Number(amount),
      metadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    { transaction: t }
  );

  return {
    success: true,
    message: 'Account credited successfully',
  };
}

async function debitAccount({
  amount,
  tag,
  accountId,
  purpose,
  reference = v4(),
  externalReference,
  metadata,
  t,
}) {
  const account = await models.Account.findOne({ where: { id: accountId } });
  if (!account) {
    return {
      success: false,
      error: "Account doesn't exist",
    };
  }

  if (Number(account.balance) < Number(amount)) {
    return {
      success: false,
      error: 'Insufficient balance',
    };
  }

  await models.Account.decrement(
    { balance: amount },
    { where: { id: accountId }, transaction: t }
  );

  await models.Transaction.create(
    {
      txnType: 'debit',
      amount,
      accountId,
      purpose,
      reference,
      externalReference,
      balanceBefore: Number(account.balance),
      balanceAfter: Number(account.balance) - Number(amount),
      metadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    { transaction: t }
  );
  return {
    success: true,
    message: 'Account debited successfully',
  };
}

module.exports = {
  creditAccount,
  debitAccount,
};
