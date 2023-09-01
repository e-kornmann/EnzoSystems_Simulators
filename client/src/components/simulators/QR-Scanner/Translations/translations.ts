type Translations = {
  [key: string]: { [key in string]: string; }[];
};

const translations: Translations = {
  qrCodeReader: [
    {
      dutch: 'QR-code reader',
      english: 'QR-code reader',
    },
  ],
  newQrForm: [
    {
      dutch: 'Voeg QR-code toe',
      english: 'Add New QR-code',
    },
  ],
  editQrList: [
    {
      dutch: 'Edit QR-codes',
      english: 'Edit QR-codes',

    },
  ],
  editQrForm: [
    {
      dutch: 'Edit QR-code',
      english: 'Edit QR-code',

    },
  ],
  deleteQr: [
    {
      dutch: 'Verwijder QR-codes',
      english: 'Delete QR-codes',
    },
  ],
  qrCodes: [
    {
      dutch: 'QR-codes',
      english: 'QR-codes',

    },
  ],
  readyToScan: [
    {
      dutch: 'Klaar om te scannen',
      english: 'Ready to scan',

    },
  ],
  couldNotConnect: [
    {
      dutch: 'Kan geen verbinding maken',
      english: 'Device could not connect',

    },
  ],
  outOfOrder: [
    {
      dutch: 'Buiten gebruik',
      english: 'Out of order',

    },
  ],
  settings: [
    {
      dutch: 'Instellingen',
      english: 'Settings',

    },
  ],
  status: [
    {
      dutch: 'Status',
      english: 'Status',

    },
  ],
  defaultLanguage: [
    {
      dutch: 'Standaardtaal',
      english: 'Default Language',
    },
  ],
  dutch: [
    {
      dutch: 'Nederlands',
      english: 'Dutch',

    },
  ],
  english: [
    {
      dutch: 'Engels',
      english: 'English',
    },
  ],
  new: [
    {
      dutch: 'Nieuw',
      english: 'New',

    },
  ],
  edit: [
    {
      dutch: 'Edit',
      english: 'Edit',

    },
  ],
  delete: [
    {
      dutch: 'Verwijder',
      english: 'Delete',

    },
  ],
  // QR-FORM

  name: [
    {
      dutch: 'Naam',
      english: 'Name',
    },
  ],
};

// Use indexed if you need a second line in a different element, i.e., a subline.
const ts = (id: string, language: string, indexed?: number): string => {
  const translation = translations[id];

  // If 'indexed' is valid use it, otherwise use the first index '[0]' as default if no index or invalid idex is given.
  const selectedTranslationIndex = (indexed && indexed >= 0 && indexed < translation.length) ? indexed : 0;

  return translation[selectedTranslationIndex][language] || '';
};

export default ts;
