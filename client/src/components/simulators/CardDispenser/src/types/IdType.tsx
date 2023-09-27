import { InputFields } from '../components/LocalAddId/LocalAddId';
import { CountriesAlpha3 } from '../enums/CountryCodesISO3166Alpha3';

export enum TypeOfDocument {
  'PASSPORT' = 'P',
  'ID_CARD_A' = 'A',
  'ID_CARD_C' = 'C',
  'ID_CARD_I' = 'I',
  'VISA' = 'V',
  'DRIVER_LICENSE' = 'DL',
}

export enum Sex {
  'Male' = 'M',
  'Female' = 'F',
  'Unspecified' = '<',
}

export type IdType = {
  [InputFields.ISSUER_CODE]: CountriesAlpha3 | undefined;
  [InputFields.DOCUMENT_NR]: string;
  [InputFields.DOCUMENT_TYPE]: TypeOfDocument | undefined;
  [InputFields.NAME_PRIMARY]: string;
  [InputFields.NAME_SECONDARY]: string;
  [InputFields.SEX]: Sex | undefined;
  [InputFields.NATIONALITY]: CountriesAlpha3 | undefined;
  [InputFields.DATE_OF_BIRTH]: string | undefined;
  [InputFields.DATE_OF_EXPIRY]: string | undefined;
};
