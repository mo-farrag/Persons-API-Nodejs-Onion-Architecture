'use strict';

const Person = require('../../enterprise_business_rules/entities/Person');
const CreatedPerson = require('../../enterprise_business_rules/entities/CreatedPerson');
const validatePerson = require('./validators/validatePerson');

module.exports = async (person, { personRepository, countryRepository }) => {
    var validationResult = await validatePerson(person, { personRepository, countryRepository });
    if (validationResult === '') {
        const createdPerson = await personRepository.create(person);

        const personResult = new CreatedPerson(createdPerson.id, createdPerson.firstName,
            createdPerson.lastName, createdPerson.countryCode, createdPerson.phone,
            createdPerson.gender, createdPerson.birthDate);

        return [validationResult, personResult];
    }
    else
        return [validationResult]
};
