import { apiConfig } from '../api/config';
import { GeneralApi } from '../api/endpoints/general-api';

export interface Country {
 // The API returns a simplified Country object directly.
 // No need for RestCountry mapping.
  name: string;
  iso2: string; // ISO 3166-1 alpha-2
  dialCode: string; // E.164 country calling code with leading +
  flagPng?: string;
  flagSvg?: string;
}

export const isoToFlagEmoji = (iso2: string): string => {
  if (!iso2 || iso2.length !== 2) return "";
  const codePoints = iso2
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// In-memory cache for fetched countries during app session
let cachedCountries: Country[] | null = null;
let lastFetchError: string | null = null;



export const fetchCountriesFromAPI = async (): Promise<Country[]> => {
  const generalApi = new GeneralApi(apiConfig);
  const response = await generalApi.authStaticCountriesGet();

  // Map API model to local Country type and ensure required fields are strings
  const apiCountries = response.data;

  if (!apiCountries || apiCountries.length === 0) {
    throw new Error('No countries could be fetched from the API');
  }

  const countries: Country[] = [];
  const seenIso2 = new Set<string>();

  for (const c of apiCountries) {
    const iso2 = (c.iso2 ?? '').toUpperCase();
    // Skip if ISO code is missing or we've already processed this country
    if (!iso2 || seenIso2.has(iso2)) continue;

    seenIso2.add(iso2);
    countries.push({
      name: c.name ?? '',
      iso2: iso2,
      dialCode: `+${c.dialCode ?? ''}`,
      flagPng: c.flagPng ?? undefined,
      flagSvg: c.flagSvg ?? undefined,
    });
  }

  // Sort alphabetically by name for a better user experience in pickers
  countries.sort((a, b) => a.name.localeCompare(b.name));
  return countries;
};

export const getCountries = async (forceRefresh = false): Promise<Country[]> => {
  if (!forceRefresh && cachedCountries && cachedCountries.length > 0) {
    return cachedCountries;
  }
  const fetched = await fetchCountriesFromAPI();
  cachedCountries = fetched;
  lastFetchError = null;
  return cachedCountries;
};

export const getLastCountriesError = () => lastFetchError;
