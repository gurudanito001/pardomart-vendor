export interface Country {
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

// Minimal shapes supported (prefer v2 for callingCodes and flags)
 type RestCountry = {
  name?: string | { common?: string };
  alpha2Code?: string; // v2
  callingCodes?: string[]; // v2
  flags?: { png?: string; svg?: string } | string; // v2 can be string or object in some mirrors
};

const mapRestToCountry = (rc: RestCountry): Country | null => {
  const iso2 = ((rc.alpha2Code || '').toString()).toUpperCase();
  if (!iso2 || iso2.length !== 2) return null;

  const name = typeof rc.name === 'string' ? rc.name : (rc.name?.common || iso2);

  // Use callingCodes (add leading + if missing)
  let dial = '';
  if (rc.callingCodes && rc.callingCodes.length > 0) {
    const cc = rc.callingCodes.find((c) => !!c);
    if (cc) dial = cc.trim().startsWith('+') ? cc.trim() : `+${cc.trim()}`;
  }
  if (!dial) return null;

  let flagPng: string | undefined;
  let flagSvg: string | undefined;
  if (typeof rc.flags === 'string') {
    if (rc.flags.endsWith('.png')) flagPng = rc.flags;
    if (rc.flags.endsWith('.svg')) flagSvg = rc.flags;
  } else if (rc.flags) {
    flagPng = rc.flags.png;
    flagSvg = rc.flags.svg;
  }

  return { name, iso2, dialCode: dial, flagPng, flagSvg };
};

export const fetchCountriesFromAPI = async (): Promise<Country[]> => {
  // Using v2 to leverage callingCodes and flags; still apply fields limit (<= 10)
  const url = 'https://restcountries.com/v2/all?fields=name,alpha2Code,callingCodes,flags';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`REST Countries error ${res.status}`);
  }
  const json: RestCountry[] = await res.json();
  const mapped: Country[] = [];
  const seen = new Set<string>();
  for (const rc of json) {
    const c = mapRestToCountry(rc);
    if (c && !seen.has(c.iso2)) {
      seen.add(c.iso2);
      mapped.push(c);
    }
  }
  mapped.sort((a, b) => a.name.localeCompare(b.name));
  if (mapped.length === 0) {
    throw new Error('No countries could be parsed from API response');
  }
  return mapped;
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
