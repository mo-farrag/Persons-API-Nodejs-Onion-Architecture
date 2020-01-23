const AccessTokenManager = require('../../../lib/application_business_rules/security/AccessTokenManager');
const mockAccessTokenManager = new AccessTokenManager();
const VerifyAccessToken = require('../../../lib/application_business_rules/use_cases/VerifyAccessToken');

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
}

test('should resolve with the decoded person data (ID) when OAuth JWT access token is valid', async () => {
  // given
  mockAccessTokenManager.decode = () => {
    return { uid: 1234, phone: '0123456789123', expireAt: new Date().addHours(1) };
  };

  // when
  const result = await VerifyAccessToken('some-jwt-access-token', '0123456789123', { accessTokenManager: mockAccessTokenManager });

  // then
  expect(result).toEqual('valid');
});

test('should resolve with the decoded person data when OAuth JWT access token is expired', async () => {
  // given
  mockAccessTokenManager.decode = () => {
    return { uid: 1234, phone: '0123456789123', expireAt: new Date().addHours(-1) };
  };

  // when
  const result = await VerifyAccessToken('some-jwt-access-token', '0123456789123', { accessTokenManager: mockAccessTokenManager });

  // then
  expect(result).toEqual('expired');
});

test('should throw an Error when OAuth JWT access token is invalid', () => {
  expect(() => {
    // given
    mockAccessTokenManager.decode = () => null;

    // when
    VerifyAccessToken('a-wrong-jwt-access-token', '0123456789123', { accessTokenManager: mockAccessTokenManager });
  }).toThrowError('Invalid access token');
});

test('should throw an Error when phone is not that same as in OAuth JWT access token', () => {

  expect(() => {
    //given
    mockAccessTokenManager.decode = () => {
      return { uid: 1234, phone: '0123456000000', expireAt: new Date().addHours(-1) };
    };

    // when
    VerifyAccessToken('some-jwt-access-token', '0123456789123', { accessTokenManager: mockAccessTokenManager });
  }).toThrowError('Invalid access token');
});

