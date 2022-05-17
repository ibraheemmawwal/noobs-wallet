module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL(20, 4).UNSIGNED,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE.toLocaleString(),
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE.toLocaleString(),
      defaultValue: DataTypes.NOW,
    },
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, {
      foreignKey: 'userId',
    });
    Account.hasMany(models.Transaction, {
      foreignKey: 'accountId',
    });
  };

  return Account;
};
