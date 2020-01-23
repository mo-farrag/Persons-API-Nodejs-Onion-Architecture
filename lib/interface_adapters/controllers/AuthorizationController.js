'use strict';

const Boom = require('@hapi/boom');
const JwtAccessTokenManager = require('../security/JwtAccessTokenManager');
const GetAccessToken = require('../../application_business_rules/use_cases/GetAccessToken');
const VerifyAccessToken = require('../../application_business_rules/use_cases/VerifyAccessToken');
const PersonRepository = require('../../application_business_rules/repositories/PersonRepository');
const personRepository = new PersonRepository();

module.exports = {

  async getAccessToken(request) {

    // Input
    const phone = request.payload['phone'];
    const password = request.payload['password'];

    // Treatment
    const accessTokenManager = new JwtAccessTokenManager();

    try {
      const accessToken = await GetAccessToken(phone, password, { accessTokenManager,personRepository });

      // Output
      return accessToken;
    } catch (err) {
      return Boom.unauthorized('Bad credentials');
    }
  },

  verifyAccessToken(request, h) {

    // Input
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw Boom.badRequest('Missing or wrong Authorization request header', 'oauth');
    }
    const accessToken = authorizationHeader.replace(/Bearer/gi, '').replace(/ /g, '');
    const phone = request.payload['phone'];

    // Treatment
    const accessTokenManager = new JwtAccessTokenManager();
    try {
      const result = VerifyAccessToken(accessToken, phone, { accessTokenManager,personRepository });

      if (result == 'valid')
        return result;
      else 
        return Boom.unauthorized(result);

      // Output
    } catch (err) {
      return Boom.badRequest('Bad credentials');
    }
  },

};