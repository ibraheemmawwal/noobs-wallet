const axios = require('axios');
const dotenv = require('dotenv');
const { creditAccount } = require('./helpers/transactions');
const models = require('./models');

dotenv.config();

const PAYSTACK_BASE_URL = 'https://api.paystack.co/charge';

function processInitialCharge(chargeResult) {
  if (chargeResult.data.status === 'success') {
    return {
      success: true,
      message: chargeResult.data.message,
      data: {
        shouldCreditAccount: true,
        reference: chargeResult.data.reference,
      },
    };
  } else {
    return {
      success: false,
      message: chargeResult.data.message,
      data: {
        shouldCreditAccount: false,
        reference: chargeResult.data.reference,
      },
    };
  }
}

async function chargeCard({
  accountId,
  pan,
  expiry_month,
  expiry_year,
  cvv,
  email,
  amount,
}) {
  try {
    const charge = await axios.post(
      PAYSTACK_BASE_URL,
      {
        card: {
          number: pan,

          expiry_month,
          expiry_year,
          cvv,
        },
        email,
        amount: amount * 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const next = processInitialCharge(charge.data);
    if (!next.success) {
      return {
        success: next.success,
        error: next.error,
      };
    }
    const t = await models.sequelize.transaction();
    try {
      if (next.data.shouldCreditAccount) {
        const creditResult = await creditAccount({
          amount,
          accountId,
          purpose: 'card',
          externalReference: next.data.reference,
          metadata: {
            externalReference: next.data.reference,
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
      return next;
    } catch (error) {
      await t.rollback();
      return {
        success: false,
        error,
      };
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

async function submitPin({
    accountId,
    pin,
    amount,
    reference

})
{
    try {
        const charge = await axios.post(`${PAYSTACK_BASE_URL}/submit_pin`, {
            reference,
            pin,
        }

chargeCard({
  accountId: 1,
  pan: '4084084084084081',
  expiry_month: '05',
  expiry_year: '23',
  cvv: '408',
  email: 'ibraheemmuhdawwal@gmail.com',
  amount: 1000.0,
})
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
