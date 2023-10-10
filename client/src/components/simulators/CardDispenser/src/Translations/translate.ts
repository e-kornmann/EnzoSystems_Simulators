// enums
import CountriesAlpha3 from '../enums/CountryCodesISO3166Alpha3';
import { Lang, APPSETTINGS, DEVICESTATUSOPTIONS, BINSTATUSES, STACKSTATUSES, CARDPOSITIONS, FAILPROCESS, BINPOLICY } from '../enums/SettingEnums';

type Translations = {
  [key: string]: { [key in Lang]: string; }[];
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
  [APPSETTINGS.FAIL_PROCESS]: [
    {
      [Lang.DUTCH]: 'Fail processing',
      [Lang.ENGLISH]: 'Fail processing',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [APPSETTINGS.BIN_POLICY]: [
    {
      [Lang.DUTCH]: 'Bin Policy',
      [Lang.ENGLISH]: 'Bin Policy',
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
  // [STACKSTATUSES.EMPTY] === [BINSTATUSES.EMPTY]
  [BINSTATUSES.EMPTY]: [
    {
      [Lang.DUTCH]: 'Leeg',
      [Lang.ENGLISH]: 'Empty',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  // [STACKSTATUSES.FULL]
  [BINSTATUSES.FULL]: [
    {
      [Lang.DUTCH]: 'Vol',
      [Lang.ENGLISH]: 'Full',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [STACKSTATUSES.LOW]: [
    {
      [Lang.DUTCH]: 'Laag',
      [Lang.ENGLISH]: 'Low',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [CARDPOSITIONS.BEZEL]: [
    {
      [Lang.DUTCH]: 'Bezel',
      [Lang.ENGLISH]: 'Bezel',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [CARDPOSITIONS.ENCODER]: [
    {
      [Lang.DUTCH]: 'Encoder',
      [Lang.ENGLISH]: 'Encoder',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [CARDPOSITIONS.STACK]: [
    {
      [Lang.DUTCH]: 'Stack',
      [Lang.ENGLISH]: 'Stack',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [FAILPROCESS.NEVER]: [
    {
      [Lang.DUTCH]: 'Nooit',
      [Lang.ENGLISH]: 'Never',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [FAILPROCESS.SPORADICALLY]: [
    {
      [Lang.DUTCH]: 'Sporadisch ',
      [Lang.ENGLISH]: 'Sporadically',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [BINPOLICY.ALLUNTAKENCARDS]: [
    {
      [Lang.DUTCH]: 'Put all untaken cards in bin',
      [Lang.ENGLISH]: 'Put all untaken cards in bin',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  [BINPOLICY.ONLYFAULSYCARDS]: [
    {
      [Lang.DUTCH]: 'Put only faulsy cards in bin',
      [Lang.ENGLISH]: 'Put only faulsy cards in bin',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
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
  defaultLanguage: [
    {
      [Lang.DUTCH]: 'Standaardtaal',
      [Lang.ENGLISH]: 'Default Language',
      [Lang.FRENCH]: 'Langue par défaut',
      [Lang.GERMAN]: 'Standardsprache',
    },
  ],
};

const translate = (id: string, language: Lang, indexed?: number): string => {
  const translation = translations[id];
  if (!translation) {
    return id; // Return the id if no translation has been found
  }

  // If 'indexed' is valid use it, otherwise use the first index '[0]' as default if no index or invalid index is given.
  const selectedTranslationIndex = (indexed && indexed >= 0 && indexed < translation.length) ? indexed : 0;

  return translation[selectedTranslationIndex][language];
};

export default translate;
