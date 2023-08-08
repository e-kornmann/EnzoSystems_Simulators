import { Lang } from "../../PaymentDevice/utils/settingsReducer";


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
  newQr: [
    {
      [Lang.DUTCH]: '..',
      [Lang.ENGLISH]: 'Add New QR-code',
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
  }

  // Use indexed if you need a second line in a different element, i.e., a subline.
  const ts = (id: string, language: Lang, indexed?: number): string => {
  const translation = translations[id];

  // If 'indexed' is valid use it, otherwise use the first index '[0]' as default if no index or invalid idex is given.
  const selectedTranslationIndex = (indexed && indexed >= 0 && indexed < translation.length) ? indexed : 0;

  return translation[selectedTranslationIndex][language] || '';
};

export default ts;
