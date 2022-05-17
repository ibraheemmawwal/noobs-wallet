const Flutterwave = require('flutterwave-node-v3');
const models = require('./models');
const dotenv = require('dotenv');
const { creditAccount, debitAccount } = require('./helpers/transactions');
const { v4 } = require('uuid');

dotenv.config();

const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);

async function chargeCard({
  tag,
  pan,
  expiry_month,
  expiry_year,
  cvv,
  amount,
  pin,
  otp,
}) {
  try {
    const t = await models.sequelize.transaction();
    const user = await models.User.findOne({ where: { username: tag } });
    if (!user) {
      return {
        success: false,
        error: "User doesn't exist",
      };
    }
    const details = {
      card_number: pan,
      cvv,
      expiry_month,
      expiry_year,
      email: user.email,
      amount: amount,
      currency: 'NGN',
      fullname: (user.firstName + ' ' + user.lastName).toUpperCase(),
      tx_ref: 'FLW' + v4(),
      enckey: process.env.enckey,
    };
    const charge = await flw.Charge.card(details);
    console.log(charge);
    if (charge.meta.authorization.mode === 'pin') {
      let payload = details;
      payload.authorization = {
        mode: 'pin',
        fields: ['pin'],
        pin: pin,
      };
      const reCallCharge = await flw.Charge.card(payload);
      console.log(reCallCharge);

      const validateCharge = await flw.Charge.validate({
        flw_ref: reCallCharge.data.flw_ref,
        otp: otp,
      });
      console.log(validateCharge);
      try {
        if (validateCharge.status === 'success') {
          const creditResult = await creditAccount({
            amount,
            tag,
            accountId: user.id,
            purpose: 'Payment',
            externalReference: validateCharge.data.flw_ref,
            metadata: {
              tx_ref: validateCharge.data.tx_ref,
            },
            t,
          });
          if (!creditResult.success) {
            await t.rollback();
            return {
              success: false,
              error: creditResult.error,
            };
          }
          await t.commit();
          return {
            success: true,
            message: 'Card charged successfully',
          };
        }
        return {
          success: false,
          error: validateCharge.message,
        };
      } catch (error) {
        await t.rollback();
        return {
          success: false,
          error,
        };
      }
    }
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data,
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }
}

// chargeCard({
//   tag: 'fola',
//   pan: '5531886652142950',
//   expiry_month: '09',
//   expiry_year: '32',
//   cvv: '564',
//   amount: 10000,
//   pin: '3310',
//   otp: '12345',
// })
//   .then(console.log)
//   .catch(console.log);

async function createAccount({ bvn, accountId }) {
  try {
    const user = await models.User.findOne({ where: { id: accountId } });
    if (!user) {
      return {
        success: false,
        error: "User doesn't exist",
      };
    }
    const details = {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      phonenumber: user.phonenumber,
      is_permanent: true,
      bvn,
      narration: (user.firstName + ' ' + user.lastName).toUpperCase(),
      tx_ref: 'flw' + v4(),
    };
    const account = await flw.VirtualAcct.create(details);
    console.log(account);
    return {
      success: true,
      message: 'Account created successfully',
    };
  } catch (err) {
    console.log(err);
  }
}

//

async function chargeBank({ tag, amount, bankCode, accountNumber }) {
  try {
    const user = await models.User.findOne({ where: { username: tag } });
    if (!user) {
      return {
        success: false,
        error: "User doesn't exist",
      };
    }
    const details = {
      amount: amount,
      currency: 'NGN',
      account_bank: bankCode,
      account_number: accountNumber,
      email: user.email,
      fullname: (user.firstName + ' ' + user.lastName).toUpperCase(),
      phonenumber: user.phonenumber,
      tx_ref: 'FLW' + v4(),
    };
    const charge = await flw.Charge.ng(details);
    console.log(charge);
  } catch (err) {
    console.log(err);
  }
}

chargeBank({
  tag: 'fola',
  amount: 100,
  bankCode: '044',
  accountNumber: '0690000031',
});

async function withdraw({ tag, amount, bankCode, accountNumber, narration }) {
  try {
    const user = await models.User.findOne({ where: { username: tag } });
    if (!user) {
      return {
        success: false,
        error: "User doesn't exist",
      };
    }

    const t = await models.sequelize.transaction();

    const reference = 'transfer-' + Date.now();
    const debitResult = await debitAccount({
      amount,
      tag,
      accountId: user.id,
      purpose: 'Withdrawal',
      externalReference: reference,
      metadata: {
        tx_ref: reference,
      },
      t,
    });
    if (!debitResult.success) {
      await t.rollback();
      return {
        success: false,
        error: debitResult.error,
      };
    } else {
      const details = {
        amount: amount,
        debit_currency: 'NGN',
        currency: 'NGN',
        account_bank: bankCode,
        account_number: accountNumber,
        email: user.email,
        fullname: (user.firstName + ' ' + user.lastName).toUpperCase(),
        phonenumber: user.phonenumber,
        tx_ref: 'FLW' + v4(),
        narrartion: narration,
        reference: reference,
      };
      const charge = await flw.Transfer.initiate(details);
      console.log(charge);
      await t.commit();
      return {
        success: true,
        message: 'Withdrawal successful',
      };
    }
  } catch (error) {
    await t.rollback();
    return {
      success: false,
      error,
    };
  }
}

// withdraw({
//   tag: 'fola',
//   amount: 10,
//   bankCode: '044',
//   accountNumber: '0690000031',
//   narration: 'Withdrawal',
// })
//   .then(console.log)

//   .catch(console.log);

// const getBanks = async () => {
//   try {
//     const payload = {
//       country: 'NG', //Pass either NG, GH, KE, UG, ZA or TZ to get list of banks in Nigeria, Ghana, Kenya, Uganda, South Africa or Tanzania respectively
//     };
//     const response = await flw.Bank.country(payload);
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// };

// getBanks();

module.exports = {
  chargeCard,
  createAccount,
  chargeBank,
  withdraw,
  getBanks,
};
