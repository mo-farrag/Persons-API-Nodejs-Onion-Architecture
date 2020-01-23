'use strict';

module.exports = class {

    constructor(id = null, firstName, lastName, countryCode, phone, gender, birthDate, avatar, email, password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.countryCode = countryCode;
        this.phone = phone;
        this.gender = gender;
        this.birthDate = birthDate;
        this.avatar = avatar;
        this.password = password;
    }

};