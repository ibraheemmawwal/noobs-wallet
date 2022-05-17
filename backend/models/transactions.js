module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    txnType: {
      type: DataTypes.ENUM('credit', 'debit'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 4).UNSIGNED,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.ENUM(
        'deposit',
        'card',
        'withdrawal',
        'transfer',
        'interest',
        'refund'
      ),
      allowNull: false,
    },
    reference: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    externalReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    balanceBefore: {
      type: DataTypes.DECIMAL(20, 4).UNSIGNED,
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(20, 4).UNSIGNED,
      allowNull: false,
    },
    metadata: DataTypes.JSON,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      allowNull: false,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, {
      foreignKey: 'accountId',
    });
  };

  return Transaction;
};
