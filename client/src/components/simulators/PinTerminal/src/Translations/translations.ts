import { Lang } from '../components/DeviceSettings/AvailableSettings/LanguageOptions';

type Translations = {
  [key: string]: { [key in Lang]: string; }[];
};

const translations: Translations = {
  welcome: [
    {
      [Lang.DUTCH]: 'WELKOM',
      [Lang.ENGLISH]: 'WELCOME',
      [Lang.FRENCH]: 'BIENVENUE',
      [Lang.GERMAN]: 'WILLKOMMEN',
    },
  ],
  outOfOrder: [
    {
      [Lang.DUTCH]: 'Buiten gebruik',
      [Lang.ENGLISH]: 'Unable to connect',
      [Lang.FRENCH]: 'Impossible de se connecter',
      [Lang.GERMAN]: 'Verbindung nicht möglich',
    },
  ],
  stopTransaction: [
    {
      [Lang.DUTCH]: 'Transactie gestopt',
      [Lang.ENGLISH]: 'Payment is canceled',
      [Lang.FRENCH]: 'Le paiement est annulé',
      [Lang.GERMAN]: 'Zahlung abgebrochen',
    },
  ],
  timedOut: [
    // mainline
    {
      [Lang.DUTCH]: 'Geen betaling',
      [Lang.ENGLISH]: 'Nothing paid',
      [Lang.FRENCH]: 'Rien payé',
      [Lang.GERMAN]: 'Keine Zahlung erfolgt',
    },
    // subline
    {
      [Lang.DUTCH]: 'Betaling verlopen',
      [Lang.ENGLISH]: 'Payment timed out',
      [Lang.FRENCH]: 'Paiement expiré',
      [Lang.GERMAN]: 'Zahlung abgelaufen',
    },
  ],
  serverError: [
    // mainline
    {
      [Lang.DUTCH]: 'Serverfout',
      [Lang.ENGLISH]: 'Server error',
      [Lang.FRENCH]: 'Erreur du serveur.',
      [Lang.GERMAN]: 'Serverfehler',
    },
    // subline
    {
      [Lang.DUTCH]: 'Kan geen betaling uitvoeren',
      [Lang.ENGLISH]: 'Unable to make payment',
      [Lang.FRENCH]: 'Impossible de réaliser le paiement',
      [Lang.GERMAN]: 'Zahlung nicht möglich',
    },
  ],
  serverError409: [
    // mainline
    {
      [Lang.DUTCH]: 'Conflict',
      [Lang.ENGLISH]: 'Conflict',
      [Lang.FRENCH]: 'Conflit',
      [Lang.GERMAN]: 'Konflikt',
    },
    // subline
    {
      [Lang.DUTCH]: 'Een andere betaling is al bezig',
      [Lang.ENGLISH]: 'Another payment was already in progress',
      [Lang.FRENCH]: 'Un autre paiement est déjà en cours',
      [Lang.GERMAN]: 'Eine andere Zahlung ist bereits im Gange',
    },
  ],
  oneMoment: [
    {
      [Lang.DUTCH]: 'Een moment geduld aub...',
      [Lang.ENGLISH]: 'One Moment please...',
      [Lang.FRENCH]: 'Un instant s\'il vous plaît...',
      [Lang.GERMAN]: 'Einen Moment bitte...',
    },
  ],
  pinError: [
    {
      [Lang.DUTCH]: 'PIN limiet overschreden.\nKaartgebruik beperkt.',
      [Lang.ENGLISH]: 'PIN Limit Exceeded.\nCard Usage Restricted.',
      [Lang.FRENCH]: 'Limite de code confidentiel dépassée.\nUtilisation de la carte restreinte.',
      [Lang.GERMAN]: 'PIN-Limit überschritten.\nKartennutzung eingeschränkt.',
    },
  ],
  amountError: [
    {
      [Lang.DUTCH]: 'Niet mogelijk om transactie te voltooien: laag saldo',
      [Lang.ENGLISH]: 'Unable to Complete\nTransaction: Low Balance',
      [Lang.FRENCH]: 'Impossible de terminer la transaction : solde insuffisant',
      [Lang.GERMAN]: 'Transaktion kann nicht abgeschlossen werden: niedriger Kontostand',
    },
  ],
  paymentAccepted: [
    {
      [Lang.DUTCH]: 'Betaling geaccepteerd',
      [Lang.ENGLISH]: 'Payment accepted',
      [Lang.FRENCH]: 'Paiement accepté',
      [Lang.GERMAN]: 'Zahlung akzeptiert',
    },
  ],
  presentCard: [
    {
      [Lang.DUTCH]: 'Presenteer Kaart',
      [Lang.ENGLISH]: 'Present Card',
      [Lang.FRENCH]: 'Présenter la carte',
      [Lang.GERMAN]: 'Karte vorzeigen',
    },
  ],
  wrongPin: [
    {
      [Lang.DUTCH]: 'Verkeerde PIN.\nProbeer opnieuw.',
      [Lang.ENGLISH]: 'Wrong PIN. Try again.',
      [Lang.FRENCH]: 'PIN incorrect. Réessayez.',
      [Lang.GERMAN]: 'Falsche PIN.\nBitte erneut versuchen.',
    },
  ],
  enterPin: [
    {
      [Lang.DUTCH]: 'Voer PIN in',
      [Lang.ENGLISH]: 'Enter Pin',
      [Lang.FRENCH]: 'Entrez le code PIN',
      [Lang.GERMAN]: 'PIN eingeben',
    },
  ],
  confirmPin: [
    {
      [Lang.DUTCH]: 'Druk OK om te bevestigen',
      [Lang.ENGLISH]: 'To confirm, press OK',
      [Lang.FRENCH]: 'Pour confirmer, appuyez sur OK',
      [Lang.GERMAN]: 'Zum Bestätigen drücken Sie OK',
    },
  ],
  amountToPay: [
    {
      [Lang.DUTCH]: 'Te betalen bedrag',
      [Lang.ENGLISH]: 'Amount to pay',
      [Lang.FRENCH]: 'Montant à payer',
      [Lang.GERMAN]: 'Zu zahlender Betrag',
    },
  ],
  // settings
  operationalMode: [
    {
      [Lang.DUTCH]: 'Operationele modus',
      [Lang.ENGLISH]: 'Operational mode',
      [Lang.FRENCH]: 'Mode opérationnel',
      [Lang.GERMAN]: 'Betriebsmodus',
    },
  ],
  normal: [
    {
      [Lang.DUTCH]: 'Normaal',
      [Lang.ENGLISH]: 'Normal',
      [Lang.FRENCH]: 'Normal',
      [Lang.GERMAN]: 'Normal',
    },
  ],
  alwaysSucceed: [
    {
      [Lang.DUTCH]: 'Altijd slagen',
      [Lang.ENGLISH]: 'Always succeed',
      [Lang.FRENCH]: 'Toujours réussir',
      [Lang.GERMAN]: 'Immer erfolgreich',
    },
  ],
  alwaysFails: [
    {
      [Lang.DUTCH]: 'Altijd mislukken',
      [Lang.ENGLISH]: 'Always fails ',
      [Lang.FRENCH]: 'Échoue toujours',
      [Lang.GERMAN]: 'Schlägt immer fehl',
    },
  ],
  firstFail: [
    {
      [Lang.DUTCH]: 'Eerst mislukken, dan slagen',
      [Lang.ENGLISH]: 'First fail, then succeed',
      [Lang.FRENCH]: 'Échec d\'abord, puis réussite',
      [Lang.GERMAN]: 'Zuerst scheitern, dann erfolgreich sein',
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
  dutch: [
    {
      [Lang.DUTCH]: 'Nederlands',
      [Lang.ENGLISH]: 'Dutch',
      [Lang.FRENCH]: 'Néerlandais',
      [Lang.GERMAN]: 'Niederländisch',
    },
  ],
  english: [
    {
      [Lang.DUTCH]: 'Engels',
      [Lang.ENGLISH]: 'English',
      [Lang.FRENCH]: 'Anglais',
      [Lang.GERMAN]: 'Englisch',
    },
  ],
  german: [
    {
      [Lang.DUTCH]: 'Duits',
      [Lang.ENGLISH]: 'German',
      [Lang.FRENCH]: 'Allemand',
      [Lang.GERMAN]: 'Deutsch',
    },
  ],
  french: [
    {
      [Lang.DUTCH]: 'Frans',
      [Lang.ENGLISH]: 'French',
      [Lang.FRENCH]: 'Français',
      [Lang.GERMAN]: 'Französisch',
    },
  ],
  askForPin: [
    {
      [Lang.DUTCH]: 'Vraag om PIN',
      [Lang.ENGLISH]: 'Ask for PIN',
      [Lang.FRENCH]: 'Demander le code PIN',
      [Lang.GERMAN]: 'PIN abfragen',
    },
  ],
  currency: [
    {
      [Lang.DUTCH]: 'Valuta',
      [Lang.ENGLISH]: 'Currency',
      [Lang.FRENCH]: 'Devise',
      [Lang.GERMAN]: 'Währung',
    },
  ],

  supportedSchemes: [
    {
      [Lang.DUTCH]: 'Ondersteunde schema\'s',
      [Lang.ENGLISH]: 'Supported schemes',
      [Lang.FRENCH]: 'Schémas pris en charge',
      [Lang.GERMAN]: 'Unterstützte Schemata',
    },
  ],
  paymentMethod: [
    {
      [Lang.DUTCH]: 'Betaalmethode',
      [Lang.ENGLISH]: 'Payment Method',
      [Lang.FRENCH]: 'Moyen de paiement',
      [Lang.GERMAN]: 'Zahlungsmethode',
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

// Use indexed if you need a second line in a different element, i.e., a subline.
const ts = (id: string, language: Lang, indexed?: number): string => {
  const translation = translations[id];
  if (!translation) {
    console.log(`Translation needed for ${id}`);
    return id; // Return the id if no translation found
  }

  // If 'indexed' is valid use it, otherwise use the first index '[0]' as default if no index or invalid idex is given.
  const selectedTranslationIndex = (indexed && indexed >= 0 && indexed < translation.length) ? indexed : 0;

  return translation[selectedTranslationIndex][language] || '';
};

export default ts;
