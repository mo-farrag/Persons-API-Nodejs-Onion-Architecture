'use strict';

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
}

module.exports = async (phone, password, { accessTokenManager,personRepository }) => {
  const person = await personRepository.getByPhone(phone);

  if (!person || person.password !== password) {
    throw new Error('Bad credentials');
  }

  var token = accessTokenManager.generate({
    uid: person.id,
    phone: phone,
    expireAt: new Date().addHours(1)
  });

  return token;
};
