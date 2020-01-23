'use strict';
module.exports = (sequelize, DataTypes) => {

   var country = sequelize.define('country', {  
      // attributes
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt:{
        type:DataTypes.DATE      
      },
      updatedAt:{
        type:DataTypes.DATE      
      }
    }, {});

    return country;
  
  };
  