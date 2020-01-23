'use strict';

const Boom = require('@hapi/boom');
const PersonSerializer = require('../serializers/PersonSerializer');
const CreatePerson = require('../../application_business_rules/use_cases/CreatePerson');
const Person = require('../../enterprise_business_rules/entities/Person');
const PersonRepository = require('../../application_business_rules/repositories/PersonRepository');
const CountryRepository = require('../../application_business_rules/repositories/CountryRepository');
const personRepository = new PersonRepository();
const countryRepository = new CountryRepository();

module.exports = {

    async createPerson(request) {
        // Input
        const { firstName, lastName, countryCode, phone, gender,
            birthDate, avatar, email, password } = request.payload;

        const person = new Person(null, firstName, lastName, countryCode, phone, gender,
            birthDate, avatar, email, password);

        // Treatment
        const personResult = await CreatePerson(person, { personRepository, countryRepository });

        if (personResult[0])
            return Boom.badRequest(personResult[0]);

        // Output
        const personSerializer = new PersonSerializer();
        return personSerializer.serialize(personResult[1]);
    }
};
