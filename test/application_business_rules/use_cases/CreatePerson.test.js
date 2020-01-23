const Person = require('../../../lib/enterprise_business_rules/entities/Person');
const Country = require('../../../lib/enterprise_business_rules/entities/Country');
const CreatedPerson = require('../../../lib/enterprise_business_rules/entities/CreatedPerson');
const PersonRepository = require('../../../lib/application_business_rules/repositories/PersonRepository');
const CountryRepository = require('../../../lib/application_business_rules/repositories/CountryRepository');
const mockPersonRepository = new PersonRepository();
const mockCountryRepository = new CountryRepository();
const CreatePerson = require('../../../lib/application_business_rules/use_cases/CreatePerson');

test('should create new person successfully', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const createdPerson = new CreatedPerson(123, 'John', 'Doe', 'EG', '0123456789123', 'male', '2000-01-01');

  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = () => null;
  mockPersonRepository.isEmailExists = () => null;
  mockCountryRepository.getByCode = jest.fn(() => country);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(mockPersonRepository.create).toHaveBeenCalledWith(inputPerson);
  expect(personResult[0]).toEqual('');
  expect(personResult[1]).toEqual(createdPerson);
});

test('should reject creating new person, missing required fields', async () => {
  // given
  const inputPerson = new Person(null, '', '', '', '', '', '', '', '', '');
  mockPersonRepository.create = jest.fn(() => null);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"firstName": "blank"}');
  expect(personResult[0]).toContain('{"lastName": "blank"}');
  expect(personResult[0]).toContain('{"countryCode": "blank"}');
  expect(personResult[0]).toContain('{"phone": "blank"}');
  expect(personResult[0]).toContain('{"gender": "blank"}');
  expect(personResult[0]).toContain('{"birthDate": "blank"}');
  expect(personResult[0]).toContain('{"avatar": "blank"}');
  expect(personResult[0]).toContain('{"password": "blank"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, phone is taken', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const existedPerson = new Person(123, 'John', 'Doe', 'EG', '0123456789123', 'male', '2000-01-01');

  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => existedPerson);
  mockCountryRepository.getByCode = jest.fn(() => country);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"phone": "taken"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, phone is not a number', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const inputPerson = new Person(null, 'John', 'Doe', 'EG', 'wrong-phone', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => country);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"phone": "not_a_number"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, phone is too short', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '012345', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn((countryCode) => country);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"phone": "too short"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, phone is too long', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '01234567891230000', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => country);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"phone": "too long"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, invalid country code', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const inputPerson = new Person(null, 'John', 'Doe', 'wrong-code', '01234567891230000', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => null);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"countryCode": "inclusion"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, invalid birthdate', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    'wrong-date', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => country);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"birthDate": "Invalid Date"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, birthdate in the future', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    '2030-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => country);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"birthDate": "in_the_future"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, email is taken', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const existedPerson = new Person(123, 'John', 'Doe', 'EG', '0123456789123', 'male', '2000-01-01');

  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');
  const countryCode = 'EG';

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn((countryCode) => country);
  mockPersonRepository.isEmailExists = jest.fn(() => existedPerson);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"email": "taken"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, invalid email', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';
  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    '2000-01-01', avatar, 'wrong-email', '123456')

  const country = new Country(1, 'Egypt', 'EG');
  const countryCode = 'EG';

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn((countryCode) => country);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"email": "invalid"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, invalid gender', async () => {
  // given
  const avatar = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGjSURBVDhPY/z//z8DuYAJSpMFqKr5x49/b97+fvj4B5SPF0D9/PzFz97Jj85f/Pz3LzQI+PlYygrlrS0EIFysAGpz/9RHZ859gusEgo+f/kyd9QTKwQFAmoHqTp35BOEjg2fPf/7+jS8uQJofPsLuQ3MT/jUbXr7/8BvKxwAgzT9//YNwIEBYiFVOlkNQkPXkmY8z5z3NyL9x5doXqBwqAGn+9RNFMxcXs7uz8Pv3UAtfvvqVV3pr/6H3EC4yAGkWE2ODcCDg8ZMfaKnu37//je33Vq9/CeXDADSq6lvvHTyCYra4GBvQTigHBsKDxTNTZKAciM1AEBooBmHAAaZOIFi59uW2XW+gHLhmHS0ebw8RCBs/6J7w8NbtbxA2VDMQlObLR4dLQDm4AdCXM+c/hbARmoEgNUG6OE8emDChfBzg7PlP37+DIghLfgZG+4o1L1eseQFRgRXs3mTEysqIszD4+vXvjj1vd+97d+PWV6gQDAB9B3QjkEG4JLl999vpc5/OnP107uJnNjammHCJuChJiBRhzXAAzCRAp0I5QMDAAABRrLq0HgiIOwAAAABJRU5ErkJggg==';

  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'wrong-gender',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => null);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"gender": "inclusion"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, wrong avatar image type', async () => {
  // given
  // .js file
  const avatar = 'J3VzZSBzdHJpY3QnOwoKY29uc3QgQm9vbSA9IHJlcXVpcmUoJ0BoYXBpL2Jvb20nKTsKY29uc3QgVXNlclJlcG9zaXRvcnlJbk1lbW9yeSA9IHJlcXVpcmUoJy4uL3N0b3JhZ2UvVXNlclJlcG9zaXRvcnlJbk1lbW9yeScpOwpjb25zdCBKd3RBY2Nlc3NUb2tlbk1hbmFnZXIgPSByZXF1aXJlKCcuLi9zZWN1cml0eS9Kd3RBY2Nlc3NUb2tlbk1hbmFnZXInKTsKY29uc3QgR2V0QWNjZXNzVG9rZW4gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvbl9idXNpbmVzc19ydWxlcy91c2VfY2FzZXMvR2V0QWNjZXNzVG9rZW4nKTsKY29uc3QgVmVyaWZ5QWNjZXNzVG9rZW4gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvbl9idXNpbmVzc19ydWxlcy91c2VfY2FzZXMvVmVyaWZ5QWNjZXNzVG9rZW4nKTsKCm1vZHVsZS5leHBvcnRzID0gewoKICBhc3luYyBnZXRBY2Nlc3NUb2tlbihyZXF1ZXN0KSB7CgogICAgLy8gSW5wdXQKICAgIGNvbnN0IGdyYW50VHlwZSA9IHJlcXVlc3QucGF5bG9hZFsnZ3JhbnRfdHlwZSddOwogICAgY29uc3QgZW1haWwgPSByZXF1ZXN0LnBheWxvYWRbJ3VzZXJuYW1lJ107CiAgICBjb25zdCBwYXNzd29yZCA9IHJlcXVlc3QucGF5bG9hZFsncGFzc3dvcmQnXTsKCiAgICBpZiAoIWdyYW50VHlwZSB8fCBncmFudFR5cGUgIT09ICdwYXNzd29yZCcpIHsKICAgICAgcmV0dXJuIEJvb20uYmFkUmVxdWVzdCgnSW52YWxpZCBhdXRoZW50aWNhdGlvbiBzdHJhdGVneScpOwogICAgfQoKICAgIC8vIFRyZWF0bWVudAogICAgY29uc3QgdXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnlJbk1lbW9yeSgpOwogICAgY29uc3QgYWNjZXNzVG9rZW5NYW5hZ2VyID0gbmV3IEp3dEFjY2Vzc1Rva2VuTWFuYWdlcigpOwoKICAgIHRyeSB7CiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgR2V0QWNjZXNzVG9rZW4oZW1haWwsIHBhc3N3b3JkLCB7IHVzZXJSZXBvc2l0b3J5LCBhY2Nlc3NUb2tlbk1hbmFnZXIgfSk7CgogICAgICAvLyBPdXRwdXQKICAgICAgcmV0dXJuIGFjY2Vzc1Rva2VuOwogICAgfSBjYXRjaCAoZXJyKSB7CiAgICAgIHJldHVybiBCb29tLnVuYXV0aG9yaXplZCgnQmFkIGNyZWRlbnRpYWxzJyk7CiAgICB9CiAgfSwKCiAgdmVyaWZ5QWNjZXNzVG9rZW4ocmVxdWVzdCwgaCkgewoKICAgIC8vIElucHV0CiAgICBjb25zdCBhdXRob3JpemF0aW9uSGVhZGVyID0gcmVxdWVzdC5oZWFkZXJzLmF1dGhvcml6YXRpb247CiAgICBpZiAoIWF1dGhvcml6YXRpb25IZWFkZXIgfHwgIWF1dGhvcml6YXRpb25IZWFkZXIuc3RhcnRzV2l0aCgnQmVhcmVyICcpKSB7CiAgICAgIHRocm93IEJvb20uYmFkUmVxdWVzdCgnTWlzc2luZyBvciB3cm9uZyBBdXRob3JpemF0aW9uIHJlcXVlc3QgaGVhZGVyJywgJ29hdXRoJyk7CiAgICB9CiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF1dGhvcml6YXRpb25IZWFkZXIucmVwbGFjZSgvQmVhcmVyL2dpLCAnJykucmVwbGFjZSgvIC9nLCAnJyk7CgogICAgLy8gVHJlYXRtZW50CiAgICBjb25zdCBhY2Nlc3NUb2tlbk1hbmFnZXIgPSBuZXcgSnd0QWNjZXNzVG9rZW5NYW5hZ2VyKCk7CiAgICB0cnkgewogICAgICBjb25zdCB7IHVpZCB9ID0gVmVyaWZ5QWNjZXNzVG9rZW4oYWNjZXNzVG9rZW4sIHsgYWNjZXNzVG9rZW5NYW5hZ2VyIH0pOwoKICAgICAgLy8gT3V0cHV0CiAgICAgIHJldHVybiBoLmF1dGhlbnRpY2F0ZWQoewogICAgICAgIGNyZWRlbnRpYWxzOiB7IHVpZCB9LAogICAgICAgIGFydGlmYWN0czogeyBhY2Nlc3NUb2tlbjogYWNjZXNzVG9rZW4gfQogICAgICB9KTsKICAgIH0gY2F0Y2ggKGVycikgewogICAgICByZXR1cm4gQm9vbS51bmF1dGhvcml6ZWQoJ0JhZCBjcmVkZW50aWFscycpOwogICAgfQogIH0sCgp9Ow==';

  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => null);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"avatar": "invalid_content_type"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});

test('should reject creating new person, invalid base64 string', async () => {
  // given
  // .js file
  const avatar = 'y4uL3N0b3JhZ2UvVXNlclJlcG9zaXRvcnlJbk1lbW9yeScpOwpjb25zdCBKd3RBY2Nlc3NUb2tlbk1hbmFnZXIgPSByZXF1aXJlKCcuLi9zZWN1cml0eS9Kd3RBY2Nlc3NUb2tlbk1hbmFnZXInKTsKY29uc3QgR2V0QWNjZXNzVG9rZW4gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvbl9idXNpbmVzc19ydWxlcy91c2VfY2FzZXMvR2V0QWNjZXNzVG9rZW4nKTsKY29uc3QgVmVyaWZ5QWNjZXNzVG9rZW4gPSByZXF1aXJlKCcuLi8uLi9hcHBsaWNhdGlvbl9idXNpbmVzc19ydWxlcy91c2VfY2FzZXMvVmVyaWZ5QWNjZXNzVG9rZW4nKTsKCm1vZHVsZS5leHBvcnRzID0gewoKICBhc3luYyBnZXRBY2Nlc3NUb2tlbihyZXF1ZXN0KSB7CgogICAgLy8gSW5wdXQKICAgIGNvbnN0IGdyYW50VHlwZSA9IHJlcXVlc3QucGF5bG9hZFsnZ3JhbnRfdHlwZSddOwogICAgY29uc3QgZW1haWwgPSByZXF1ZXN0LnBheWxvYWRbJ3VzZXJuYW1lJ107CiAgICBjb25zdCBwYXNzd29yZCA9IHJlcXVlc3QucGF5bG9hZFsncGFzc3dvcmQnXTsKCiAgICBpZiAoIWdyYW50VHlwZSB8fCBncmFudFR5cGUgIT09ICdwYXNzd29yZCcpIHsKICAgICAgcmV0dXJuIEJvb20uYmFkUmVxdWVzdCgnSW52YWxpZCBhdXRoZW50aWNhdGlvbiBzdHJhdGVneScpOwogICAgfQoKICAgIC8vIFRyZWF0bWVudAogICAgY29uc3QgdXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnlJbk1lbW9yeSgpOwogICAgY29uc3QgYWNjZXNzVG9rZW5NYW5hZ2VyID0gbmV3IEp3dEFjY2Vzc1Rva2VuTWFuYWdlcigpOwoKICAgIHRyeSB7CiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgR2V0QWNjZXNzVG9rZW4oZW1haWwsIHBhc3N3b3JkLCB7IHVzZXJSZXBvc2l0b3J5LCBhY2Nlc3NUb2tlbk1hbmFnZXIgfSk7CgogICAgICAvLyBPdXRwdXQKICAgICAgcmV0dXJuIGFjY2Vzc1Rva2VuOwogICAgfSBjYXRjaCAoZXJyKSB7CiAgICAgIHJldHVybiBCb29tLnVuYXV0aG9yaXplZCgnQmFkIGNyZWRlbnRpYWxzJyk7CiAgICB9CiAgfSwKCiAgdmVyaWZ5QWNjZXNzVG9rZW4ocmVxdWVzdCwgaCkgewoKICAgIC8vIElucHV0CiAgICBjb25zdCBhdXRob3JpemF0aW9uSGVhZGVyID0gcmVxdWVzdC5oZWFkZXJzLmF1dGhvcml6YXRpb247CiAgICBpZiAoIWF1dGhvcml6YXRpb25IZWFkZXIgfHwgIWF1dGhvcml6YXRpb25IZWFkZXIuc3RhcnRzV2l0aCgnQmVhcmVyICcpKSB7CiAgICAgIHRocm93IEJvb20uYmFkUmVxdWVzdCgnTWlzc2luZyBvciB3cm9uZyBBdXRob3JpemF0aW9uIHJlcXVlc3QgaGVhZGVyJywgJ29hdXRoJyk7CiAgICB9CiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF1dGhvcml6YXRpb25IZWFkZXIucmVwbGFjZSgvQmVhcmVyL2dpLCAnJykucmVwbGFjZSgvIC9nLCAnJyk7CgogICAgLy8gVHJlYXRtZW50CiAgICBjb25zdCBhY2Nlc3NUb2tlbk1hbmFnZXIgPSBuZXcgSnd0QWNjZXNzVG9rZW5NYW5hZ2VyKCk7CiAgICB0cnkgewogICAgICBjb25zdCB7IHVpZCB9ID0gVmVyaWZ5QWNjZXNzVG9rZW4oYWNjZXNzVG9rZW4sIHsgYWNjZXNzVG9rZW5NYW5hZ2VyIH0pOwoKICAgICAgLy8gT3V0cHV0CiAgICAgIHJldHVybiBoLmF1dGhlbnRpY2F0ZWQoewogICAgICAgIGNyZWRlbnRpYWxzOiB7IHVpZCB9LAogICAgICAgIGFydGlmYWN0czogeyBhY2Nlc3NUb2tlbjogYWNjZXNzVG9rZW4gfQogICAgICB9KTsKICAgIH0gY2F0Y2ggKGVycikgewogICAgICByZXR1cm4gQm9vbS51bmF1dGhvcml6ZWQoJ0JhZCBjcmVkZW50aWFscycpOwogICAgfQogIH0sCgp9Ow==';

  const inputPerson = new Person(null, 'John', 'Doe', 'EG', '0123456789123', 'male',
    '2000-01-01', avatar, 'john@mail.com', '123456')

  const country = new Country(1, 'Egypt', 'EG');

  mockPersonRepository.isPhoneExists = jest.fn(() => null);
  mockCountryRepository.getByCode = jest.fn(() => null);
  mockPersonRepository.isEmailExists = jest.fn(() => null);
  mockPersonRepository.create = jest.fn(() => createdPerson);

  // when
  const personResult = await CreatePerson(inputPerson, { personRepository: mockPersonRepository, countryRepository: mockCountryRepository });

  // then
  expect(personResult[0]).toContain('{"avatar": "invalid_content_type"}');
  expect(mockPersonRepository.create).toHaveBeenCalledTimes(0);
  expect(personResult[1]).toEqual(undefined);
});