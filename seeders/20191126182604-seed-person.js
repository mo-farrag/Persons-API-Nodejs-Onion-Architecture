'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('persons', [{
      firstName: 'Snoop',
      lastName: 'Dog',
      phone: '11122223333',
      gender: 'male',
      birthDate: '2000-04-01',
      countryCode: 'EG',
      email: 'snoopydog@dogpound.com',
      avatar: 'a',
      password: '123456',
      createdAt: '2019-11-11',
      updatedAt: '2019-11-11'
    }, {
      firstName: 'Scooby',
      lastName: 'Doo',
      phone: '44455556666',
      gender: 'male',
      birthDate: '2000-04-01',
      countryCode: 'EG',
      email: 'scooby.doo@misterymachine.com',
      avatar: 'a',
      password: '123456',
      createdAt: '2019-11-11',
      updatedAt: '2019-11-11'
    }, {
      firstName: 'Herbie',
      lastName: 'Husker',
      phone: '40243770001',
      gender: 'male',
      birthDate: '2000-04-01',
      countryCode: 'EG',
      email: 'herbie.husker@unl.edu',
      avatar: 'a',
      password: '123456',
      createdAt: '2019-11-11',
      updatedAt: '2019-11-11'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('persons', null, {});
  }
};
