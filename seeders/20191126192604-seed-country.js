'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('countries', [{
      name: 'Egypt',
      code: 'EG',
      createdAt: '2019-11-11',
      updatedAt: '2019-11-11'
    },{
      name: 'United states',
      code: 'US',
      createdAt: '2019-11-11',
      updatedAt: '2019-11-11'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('countries', null, {});
  }
};
