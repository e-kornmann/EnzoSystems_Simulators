import { memo, useMemo } from 'react';
import { CountriesAlpha3 } from '../enums/CountryCodesISO3166Alpha3';
import { Lang } from '../App';
import { InputFields } from '../components/LocalAddId/LocalAddId';

type Props = {
  id: string,
  language: Lang,
  indexed?: number
};

// Use indexed if you need a second line in a different element, i.e., a subline.
const TsComponent = ({ id, language, indexed }: Props) => {
  type Translations = {
    [key: InputFields | string]: { [key in Lang]: string; }[];
  };

  const translations = useMemo<Translations>(() => ({
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
        [Lang.DUTCH]: 'Hoofdnaam',
        [Lang.ENGLISH]: 'Primary Name',
        [Lang.FRENCH]: 'Nom principal',
        [Lang.GERMAN]: 'Hauptname',
      },
    ],
    [InputFields.NAME_SECONDARY]: [
      {
        [Lang.DUTCH]: 'Secundaire naam',
        [Lang.ENGLISH]: 'Secondary Name',
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
    year: [
      {
        [Lang.DUTCH]: 'jaar',
        [Lang.ENGLISH]: 'year',
        [Lang.FRENCH]: '..',
        [Lang.GERMAN]: '..',
      },
    ],
    month: [
      {
        [Lang.DUTCH]: 'maand',
        [Lang.ENGLISH]: 'month',
        [Lang.FRENCH]: 'NON',
        [Lang.GERMAN]: 'NEIN',
      },
    ],
    day: [
      {
        [Lang.DUTCH]: 'dag',
        [Lang.ENGLISH]: 'day',
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
  }), []);

  const translation = translations[id];
  // If 'indexed' is valid use it, otherwise use the first index '[0]' as default if no index or invalid idex is given.
  const selectedTranslationIndex = (indexed && indexed >= 0 && indexed < translation.length) ? indexed : 0;

  return translation[selectedTranslationIndex][language] || '';
};

export const Translate = memo(TsComponent);
