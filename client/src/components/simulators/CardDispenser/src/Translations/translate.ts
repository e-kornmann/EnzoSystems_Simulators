// enums
import CountriesAlpha3 from '../enums/CountryCodesISO3166Alpha3';
import APPSETTINGS from '../enums/AppSettings';
import DEVICESTATUSOPTIONS from '../enums/DeviceStatusOptions';
import Lang from '../enums/Lang';
import InputFields from '../enums/InputFields';

type Translations = {
  [key: InputFields | APPSETTINGS | DEVICESTATUSOPTIONS | string ]
  : {
    [key in Lang]: string;
  }[];
};

const translations: Translations = {
  [APPSETTINGS.DEVICE_STATUS]: [
    {
      [Lang.DUTCH]: 'Device Status',
      [Lang.ENGLISH]: 'Device Status',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [APPSETTINGS.CARD_STACK]: [
    {
      [Lang.DUTCH]: 'Card Stack',
      [Lang.ENGLISH]: 'Card Stack',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [APPSETTINGS.CARD_POSITION]: [
    {
      [Lang.DUTCH]: 'Card Position',
      [Lang.ENGLISH]: 'Card Position',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [APPSETTINGS.BIN]: [
    {
      [Lang.DUTCH]: 'Bin',
      [Lang.ENGLISH]: 'Bin',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [DEVICESTATUSOPTIONS.CONNECTED]: [
    {
      [Lang.DUTCH]: 'Connected',
      [Lang.ENGLISH]: 'Connected',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [DEVICESTATUSOPTIONS.DISCONNECTED]: [
    {
      [Lang.DUTCH]: 'Disconnected',
      [Lang.ENGLISH]: 'Disconnected',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [DEVICESTATUSOPTIONS.OUT_OF_ORDER]: [
    {
      [Lang.DUTCH]: 'Buiten gebruik',
      [Lang.ENGLISH]: 'Out of order',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [InputFields.DATE_OF_BIRTH]: [
    {
      [Lang.DUTCH]: 'Geboortedatum',
      [Lang.ENGLISH]: 'Date of Birth',
      [Lang.FRENCH]: 'Date de naissance',
      [Lang.GERMAN]: 'Geburtsdatum',
    },
  ],
  [InputFields.DATE_OF_EXPIRY]: [
    {
      [Lang.DUTCH]: 'Verloopdatum',
      [Lang.ENGLISH]: 'Date of Expiry',
      [Lang.FRENCH]: 'Date d\'expiration',
      [Lang.GERMAN]: 'Ablaufdatum',
    },
  ],
  [InputFields.DOCUMENT_NR]: [
    {
      [Lang.DUTCH]: 'Documentnummer',
      [Lang.ENGLISH]: 'Document Number',
      [Lang.FRENCH]: 'Numéro de document',
      [Lang.GERMAN]: 'Dokumentennummer',
    },
  ],
  [InputFields.DOCUMENT_TYPE]: [
    {
      [Lang.DUTCH]: 'Soort document',
      [Lang.ENGLISH]: 'Document Type',
      [Lang.FRENCH]: 'Type de document',
      [Lang.GERMAN]: 'Dokumenttyp',
    },
  ],
  [InputFields.ISSUER_CODE]: [
    {
      [Lang.DUTCH]: 'Uitgevercode',
      [Lang.ENGLISH]: 'Issuer Code',
      [Lang.FRENCH]: 'Code émetteur',
      [Lang.GERMAN]: 'Herausgebercode',
    },
  ],
  [InputFields.NAME_PRIMARY]: [
    {
      [Lang.DUTCH]: 'Achternaam',
      [Lang.ENGLISH]: 'Surname',
      [Lang.FRENCH]: 'Nom principal',
      [Lang.GERMAN]: 'Hauptname',
    },
  ],
  [InputFields.NAME_SECONDARY]: [
    {
      [Lang.DUTCH]: 'Voornaam',
      [Lang.ENGLISH]: 'Given names',
      [Lang.FRENCH]: 'Nom secondaire',
      [Lang.GERMAN]: 'Sekundärname',
    },
  ],
  [InputFields.NATIONALITY]: [
    {
      [Lang.DUTCH]: 'Nationaliteit',
      [Lang.ENGLISH]: 'Nationality',
      [Lang.FRENCH]: 'Nationalité',
      [Lang.GERMAN]: 'Nationalität',
    },
  ],
  [InputFields.SEX]: [
    {
      [Lang.DUTCH]: 'Geslacht',
      [Lang.ENGLISH]: 'Sex',
      [Lang.FRENCH]: 'Sexe',
      [Lang.GERMAN]: 'Geschlecht',
    },
  ],
  defaultLanguage: [
    {
      [Lang.DUTCH]: 'Standaardtaal',
      [Lang.ENGLISH]: 'Default Language',
      [Lang.FRENCH]: 'Langue par défaut',
      [Lang.GERMAN]: 'Standardsprache',
    },
  ],
  [CountriesAlpha3.Netherlands]: [
    {
      [Lang.DUTCH]: 'Nederlands',
      [Lang.ENGLISH]: 'Dutch',
      [Lang.FRENCH]: 'Néerlandais',
      [Lang.GERMAN]: 'Niederländisch',
    },
  ],
  [CountriesAlpha3['United Kingdom']]: [
    {
      [Lang.DUTCH]: 'Engels',
      [Lang.ENGLISH]: 'English',
      [Lang.FRENCH]: 'Anglais',
      [Lang.GERMAN]: 'Englisch',
    },
  ],
  [CountriesAlpha3.Germany]: [
    {
      [Lang.DUTCH]: 'Duits',
      [Lang.ENGLISH]: 'German',
      [Lang.FRENCH]: 'Allemand',
      [Lang.GERMAN]: 'Deutsch',
    },
  ],
  [CountriesAlpha3.France]: [
    {
      [Lang.DUTCH]: 'Frans',
      [Lang.ENGLISH]: 'French',
      [Lang.FRENCH]: 'Français',
      [Lang.GERMAN]: 'Französisch',
    },
  ],
  P: [
    {
      [Lang.DUTCH]: 'Paspoort',
      [Lang.ENGLISH]: 'Passport',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  year: [
    {
      [Lang.DUTCH]: 'jjjj',
      [Lang.ENGLISH]: 'yyyy',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  month: [
    {
      [Lang.DUTCH]: 'mm',
      [Lang.ENGLISH]: 'mm',
      [Lang.FRENCH]: 'NON',
      [Lang.GERMAN]: 'NEIN',
    },
  ],
  day: [
    {
      [Lang.DUTCH]: 'dd',
      [Lang.ENGLISH]: 'dd',
      [Lang.FRENCH]: 'NON',
      [Lang.GERMAN]: 'NEIN',
    },
  ],
  yes: [
    {
      [Lang.DUTCH]: 'JA',
      [Lang.ENGLISH]: 'YES',
      [Lang.FRENCH]: 'OUI',
      [Lang.GERMAN]: 'JA',
    },
  ],
  no: [
    {
      [Lang.DUTCH]: 'NEE',
      [Lang.ENGLISH]: 'NO',
      [Lang.FRENCH]: 'NON',
      [Lang.GERMAN]: 'NEIN',
    },
  ],
};

const translate = (id: string, language: Lang, indexed?: number): string => {
  const translation = translations[id];
  if (!translation) {
    return id; // Return the id if no translation found
  }

  // If 'indexed' is valid use it, otherwise use the first index '[0]' as default if no index or invalid index is given.
  const selectedTranslationIndex = (indexed && indexed >= 0 && indexed < translation.length) ? indexed : 0;

  return translation[selectedTranslationIndex][language];
};

export default translate;
