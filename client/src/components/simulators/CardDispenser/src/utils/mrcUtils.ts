enum CharacterEncoding {
  '' = '',
  Ä = 'AE',
  Å = 'AA',
  Æ = 'AE',
  Ĳ = 'IJ',
  ĳ = 'IJ',
  Ñ = 'N',
  Ö = 'OE',
  Ø = 'OE',
  Ü = 'UE',
  ß = 'SS',
}

const encodeInput = (inputString: string) => {
  const capitalizedString = inputString.toUpperCase();
  return capitalizedString
    .replace(/[ÄÅÆĲĳÑÖØÜß]/g, match => CharacterEncoding[match as keyof typeof CharacterEncoding] || match);
};

// this function has not been tested yet

const calculateCheckDigit = (passportNumber: string): number => {
  const charToNumber: Record<string, number> = {
    '<': 0,
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 18,
    J: 19,
    K: 20,
    L: 21,
    M: 22,
    N: 23,
    O: 24,
    P: 25,
    Q: 26,
    R: 27,
    S: 28,
    T: 29,
    U: 30,
    V: 31,
    W: 32,
    X: 33,
    Y: 34,
    Z: 35,
  };

  let sum = 0;
  const weights = [7, 3, 1, 7, 3, 1, 7, 3, 1];

  for (let i = 0; i < passportNumber.length; i++) {
    const char = passportNumber[i];
    const value = charToNumber[char.toUpperCase()] || parseInt(char, 10) || 0;
    sum += value * weights[i % 9];
  }

  const remainder = sum % 10;
  return (10 - remainder) % 10;
};

export { encodeInput, calculateCheckDigit };
