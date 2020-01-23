'use strict';

module.exports = class {

    constructor(id , firstName, lastName, countryCode, phone, gender, birthDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.countryCode = countryCode;
        this.phone = phone;
        this.gender = gender;
        this.birthDate = birthDate;
    }

};