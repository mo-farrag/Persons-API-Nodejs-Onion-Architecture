'use strict';

const db = require('../../frameworks_drivers/database/models');
const Person = require('../../enterprise_business_rules/entities/Person');

module.exports = class {
  constructor() {
    
  }
  create(person) {
    const { firstName, lastName, countryCode, phone, gender,
      birthDate, avatar, email, password } = person;

    return db.persons.create({
      firstName, lastName, countryCode, phone,
      gender, birthDate, avatar, email, password
    })
  }

  getByPhone(phone) {
    return db.persons.findOne({ where: { phone: phone } });
  }

  isPhoneExists(phone) {
    return db.persons.findOne({ where: { phone: phone } });
  }

  isEmailExists(email) {
    return db.persons.findOne({ where: { email: email } });
  }
}

