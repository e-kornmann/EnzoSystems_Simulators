import { Lang } from "../../PaymentDevice/DeviceSettings/AvailableSettings/LanguageOptions";

type Translations = {
  [key: string]: { [key in Lang]: string; }[];
}

const translations: Translations = {
  qrCodeReader: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'QR-code reader',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  newQrForm: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'Add New QR-code',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  editQrList: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'Edit QR-codes',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  editQrForm: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'Edit QR-code',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  deleteQr: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'Delete QR-codes',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  qrCodes: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'QR-codes',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  readyToScan: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'Ready to scan',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  outOfOrder: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'Out of order',
      [Lang.FRENCH]: '..',
      [Lang.GERMAN]: '..',
    },
  ],
  }

  // Use indexed if you need a second line in a different element, i.e., a subline.
  const ts = (id: string, language: Lang, indexed?: number): string => {
  const translation = translations[id];

  // If 'indexed' is valid use it, otherwise use the first index '[0]' as default if no index or invalid idex is given.
  const selectedTranslationIndex = (indexed && indexed >= 0 && indexed < translation.length) ? indexed : 0;

  return translation[selectedTranslationIndex][language] || '';
};

export default ts;



