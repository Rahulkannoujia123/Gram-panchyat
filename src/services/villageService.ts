import { Village } from '../types';

/**
 * Village Service - Fetches village data from multiple sources
 * Priority: API -> Fallback local data
 */

// Prindra block के coordinates
const PRINDRA_COORDINATES = {
  stateCode: '36', // Uttar Pradesh
  state: 'Uttar Pradesh',
  districtCode: '100', // Varanasi
  district: 'Varanasi',
  subdistrictCode: '9', // Pindra
  subdistrict: 'Pindra',
};

/**
 * Fetch villages from Open Data Stack
 * This API provides village data from Indian government records
 */
export async function fetchVillagesFromOpenDataStack(): Promise<Village[] | null> {
  try {
    const params = new URLSearchParams({
      state: PRINDRA_COORDINATES.state,
      district: PRINDRA_COORDINATES.district,
      block: PRINDRA_COORDINATES.subdistrict,
      format: 'json',
    });

    const response = await fetch(
      `https://opendatastack.in/api/villages?${params.toString()}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('OpenDataStack API failed');

    const data = await response.json();
    if (data.villages && Array.isArray(data.villages)) {
      return data.villages.map((v: any, idx: number) => ({
        id: idx + 1,
        name: v.name || v.village_name,
        population: v.population || 0,
        wards: v.wards || 0,
        sarpanch: v.sarpanch,
        phone: v.phone,
        icon: '🏘️',
        description: v.description || `${v.name || v.village_name} गाँव, प्रेंद्रा`,
      }));
    }
  } catch (err) {
    console.log('OpenDataStack API error:', err);
  }
  return null;
}

/**
 * Fetch villages from data.gov.in CKAN API
 */
export async function fetchVillagesFromDataGov(): Promise<Village[] | null> {
  try {
    // Trying CKAN API endpoint for LGD data
    const resourceId = 'f0aedc01-2e2d-4e6e-b926-6b5e1f47ab45';
    const sqlQuery = `SELECT * FROM "${resourceId}" WHERE "stateNameEnglish"='Uttar Pradesh' AND "districtNameEnglish"='Varanasi' AND "subdistrictNameEnglish"='Pindra' LIMIT 1000`;

    const response = await fetch(
      `https://www.data.gov.in/api/3/action/datastore_search_sql?sql=${encodeURIComponent(sqlQuery)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('data.gov.in API failed');

    const data = await response.json();
    if (data.success && data.result && data.result.records) {
      return data.result.records.map((record: any, idx: number) => ({
        id: idx + 1,
        name: record.villageNameEnglish || record.village_name || 'Unknown',
        population: record.population || 0,
        wards: record.wards || 0,
        sarpanch: record.sarpanch,
        phone: record.phone,
        icon: '🏘️',
        description: `${record.villageNameEnglish} गाँव, पिंड्रा ब्लॉक, वाराणसी`,
      }));
    }
  } catch (err) {
    console.log('data.gov.in API error:', err);
  }
  return null;
}

/**
 * Fetch villages from Census/Revenue data via Wikipedia or local APIs
 */
export async function fetchVillagesFromWikipedia(): Promise<Village[] | null> {
  try {
    const response = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&titles=Pindra_block&prop=extracts&explaintext=true&format=json&origin=*'
    );

    if (!response.ok) throw new Error('Wikipedia API failed');

    const data = await response.json();
    // Wikipedia API would provide general info, not structured village list
    // This is a fallback only
    console.log('Wikipedia data available but not structured for villages');
  } catch (err) {
    console.log('Wikipedia API error:', err);
  }
  return null;
}

/**
 * Try multiple API sources in sequence
 * Falls back to local data if all external APIs fail
 */
export async function fetchVillagesFromAPIs(): Promise<Village[] | null> {
  // Try APIs in order of preference
  const apiSources = [
    { name: 'OpenDataStack', fn: fetchVillagesFromOpenDataStack },
    { name: 'data.gov.in', fn: fetchVillagesFromDataGov },
    { name: 'Wikipedia', fn: fetchVillagesFromWikipedia },
  ];

  for (const source of apiSources) {
    try {
      console.log(`[VillageService] Trying ${source.name}...`);
      const result = await Promise.race([
        source.fn(),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error(`${source.name} timeout`)), 5000)
        ),
      ]);

      if (result && result.length > 0) {
        console.log(`[VillageService] Successfully fetched ${result.length} villages from ${source.name}`);
        return result;
      }
    } catch (err) {
      console.log(`[VillageService] ${source.name} failed:`, err);
      continue;
    }
  }

  console.log('[VillageService] All external APIs failed, returning null for fallback');
  return null;
}
