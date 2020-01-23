'use strict';

const _serializeSinglePerson = (person) => {
  return {
    'id': person.id,
    'first-name': person.firstName,
    'last-name': person.lastName,
    'countryCode': person.countryCode,
    'phone': person.phone,
    'gender': person.gender,
    'birthDate': person.birthDate,
    'avatar': person.avatar,
    'email': person.email,
    'password': person.password
  };
};

module.exports = class {

  serialize(data) {
    if (!data) {
      throw new Error('Expect data to be not undefined nor null');
    }
    if (Array.isArray(data)) {
      return data.map(_serializeSinglePerson);
    }
    return _serializeSinglePerson(data);
  }

};