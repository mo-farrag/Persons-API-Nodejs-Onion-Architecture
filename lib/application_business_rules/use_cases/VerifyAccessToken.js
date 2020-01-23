'use strict';

module.exports = (accessToken, phone, { accessTokenManager }) => {
  const decoded = accessTokenManager.decode(accessToken);
  if (!decoded) {
    throw new Error('Invalid access token');
  }

  if (decoded.phone !== phone)
    throw new Error('Invalid access token');

  if (new Date(decoded.expireAt) > new Date())
    return 'valid';
  else
    return 'expired';
};
