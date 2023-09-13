import { Country } from '../enums/CountryCodesEnum';

enum PassportDocument {
  ENGLISH = 'PASSPORT',
  FRENCH = 'PASSEPORT',
  SPANISH = 'PASAPORTE',
  DUTCH = 'PASPOORT',
  GERMAN = 'REISEPASS',
}

const translate = {
  male: {
    DUTCH: 'Man M',
    ENGLISH: 'Male',
  },
  female: {
    DUTCH: 'Vrouw F',
    ENGLISH: 'Female',
  },
  unspecified: {
    DUTCH: 'Ongespecificeerd X',
    ENGLISH: 'Unspecified',
  },
};

export type PassPort = {
  issuingOrganization: string, // full Organinsation name
  document: PassportDocument, // The word for passport in the language of the issuing organization
  documentCode: string,
  issuingOrganizationCode: string, // Three-letter code
  passPortNr: string,
  name: string, // full name
  primaryId: string, // Primary Identifier
  secondaryId: string, // Secondary Identifier
  nationality: Country, // 2 letter-Countrycode
  dateOfBirth: string,
  personalNumber: string,
  sex: string,
  placeOfBirth: string,
  dateOfIssue: string,
  authority?: string,
  dateOfExpiry: string,
};

export const examplePassPort: PassPort = {
  issuingOrganization: 'Example Org',
  document: PassportDocument.ENGLISH,
  documentCode: '12345',
  issuingOrganizationCode: 'ABC',
  passPortNr: '67890',
  name: 'John Doe',
  primaryId: 'ID123',
  secondaryId: 'ID456',
  nationality: Country.UnitedStates,
  dateOfBirth: '1990-01-01',
  personalNumber: '123456789',
  sex: translate.male.ENGLISH,
  placeOfBirth: 'Boston',
  dateOfIssue: '2001-05-14',
  dateOfExpiry: '2001-05-14',
};
