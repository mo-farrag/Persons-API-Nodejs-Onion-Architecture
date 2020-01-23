'use strict';
module.exports = (sequelize, DataTypes) => {
  var person = sequelize.define('persons', {

    // attributes
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   len: {
      //       args: [11, 14],
      //       msg: "too_short"
      //   }
      // }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      // isIn: {
      //   args: [['male', 'female']],
      //   msg: "inclusion"
      // }
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true//,
      // validate: {
      //   len: {
      //     args: [6, 128],
      //     msg: "Email address must be between 6 and 128 characters in length"
      //   },
      //   isEmail: {
      //     msg: "Email address must be valid"
      //   }
      // }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {});

  return person;
};
