import CountriesAlpha3 from './CountryCodesISO3166Alpha3';

enum Lang {
  DUTCH = CountriesAlpha3.Netherlands,
  ENGLISH = CountriesAlpha3['United Kingdom'],
  GERMAN = CountriesAlpha3.Germany,
  FRENCH = CountriesAlpha3.France,
}
export default Lang;
