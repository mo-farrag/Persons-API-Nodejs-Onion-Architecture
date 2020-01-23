'use strict';

const util = require('util');
const validator = require("email-validator");
const moment = require('moment');
const fileType = require('file-type')
const validatePhoneNumber = require('validate-phone-number-node-js');


module.exports = async (person, { personRepository, countryRepository }) => {
    var errors = [];

    if (person.firstName == '')
        errors.push('{"firstName": "blank"}');

    if (person.lastName == '')
        errors.push('{"lastName": "blank"}');

    if (person.countryCode == '')
        errors.push('{"countryCode": "blank"}');
    else {
        var country = await countryRepository.getByCode(person.countryCode)
        if (!country)
            errors.push('{"countryCode": "inclusion"}');
    }

    if (person.phone == '')
        errors.push('{"phone": "blank"}');
    else {
        if (person.phone.length < 11)
            errors.push('{"phone": "too short"}');
        else if (person.phone.length > 14)
            errors.push('{"phone": "too long"}');
        else if (!validatePhoneNumber.validate(person.phone))
            errors.push('{"phone": "not_a_number"}');
        else {
            var isPhoneExists = await personRepository.isPhoneExists(person.phone)
            if (isPhoneExists)
                errors.push('{"phone": "taken"}');
        }
    }

    if (person.gender == '')
        errors.push('{"gender": "blank"}');
    else {
        if (person.gender !== 'male' && person.gender !== 'female')
            errors.push('{"gender": "inclusion"}')
    }

    if (person.birthDate == '')
        errors.push('{"birthDate": "blank"}');
    else {
        const dateFormat = "YYYY-MM-DD";
        if (!moment(person.birthDate, dateFormat, true).isValid())
            errors.push('{"birthDate": "Invalid Date"}');
        else if (Date.parse(person.birthDate) > new Date())
            errors.push('{"birthDate": "in_the_future"}');
    }

    if (person.email != '') {
        if (!validator.validate(person.email))
            errors.push('{"email": "invalid"}');
        else {
            const isEmailExists = await personRepository.isEmailExists(person.email)
            if (isEmailExists)
                errors.push('{"email": "taken"}');
        }
    }

    if (person.avatar == '')
        errors.push('{"avatar": "blank"}')
    else {
        const mimeInfo = fileType(Buffer.from(person.avatar, 'base64'))
        if (!mimeInfo || (mimeInfo.ext != 'png' && mimeInfo.ext != 'jpg')) {
            errors.push('{"avatar": "invalid_content_type"}')
        }
    }

    if (person.password == '')
        errors.push('{"password": "blank"}');

    if (errors.length > 0)
        return util.format('[%s]', errors.join(','));
    else
        return '';
};
