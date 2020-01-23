const PersonRepository = require('../../../lib/application_business_rules/repositories/PersonRepository');
const mockPersonRepository = new PersonRepository();
const Person = require('../../../lib/enterprise_business_rules/entities/Person');

const AccessTokenManager = require('../../../lib/application_business_rules/security/AccessTokenManager');
const MockAccessTokenManager = class extends AccessTokenManager { };
const mockAccessTokenManager = new MockAccessTokenManager();

const GetAccessToken = require('../../../lib/application_business_rules/use_cases/GetAccessToken');

test('should resolve with a generated JWT access token when credentials are ok', async () => {
  // given
  const existedPerson = new Person(123, 'John', 'Doe', 'EG', '0123456789123', 'male', '2000-01-01', '', '', 'abcd-1234');
  mockPersonRepository.getByPhone = jest.fn(() => existedPerson);

  mockAccessTokenManager.generate = () => 'generated-jwt-access-token';

  // when
  const accessToken = await GetAccessToken('0123456789123', 'abcd-1234', {
    accessTokenManager: mockAccessTokenManager,
    personRepository: mockPersonRepository
  });

  // then
  expect(accessToken).toBe('generated-jwt-access-token');
});

test('should reject when user was not found', () => {
  // given
  mockPersonRepository.getByPhone = () => null;

  // when
  const promise = GetAccessToken('0123456789123', 'abcd-1234', {
    accessTokenManager: mockAccessTokenManager,
    personRepository: mockPersonRepository
  });

  // then
  return expect(promise).rejects.toThrow('Bad credentials');
});

test('should reject when password did not match', () => {
  // given
  const existedPerson = new Person(123, 'John', 'Doe', 'EG', '0123456789123', 'male', '2000-01-01', '', '', 'abcd-1234');
  mockPersonRepository.getByPhone = jest.fn(() => existedPerson);
  //mockPersonRepository.getByPhone = () => { return { password: 'abcd-1234' } };

  // when
  const promise = GetAccessToken('0123456789123', 'wrong-password', {
    accessTokenManager: mockAccessTokenManager,
    personRepository: mockPersonRepository
  });

  // then
  return expect(promise).rejects.toThrow('Bad credentials');
});
