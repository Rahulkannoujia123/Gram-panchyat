/**
 * Pradhan (Sarpanch) Data Service
 * Fetches elected representative information from multiple API sources
 */

export interface PradhanData {
  villageId: number;
  name: string;
  phone?: string;
  email?: string;
  tenure?: {
    startYear?: number;
    endYear?: number;
  };
  party?: string;
  photo?: string;
  source: 'api' | 'local';
}

// Local fallback pradhan data for Pindra block
const localPradhanData: Record<number, PradhanData> = {
  1: { villageId: 1, name: 'राजेश सिंह', phone: '9876543210', source: 'local' },
  2: { villageId: 2, name: 'विनोद शर्मा', phone: '9876543211', source: 'local' },
  3: { villageId: 3, name: 'कमल किशोर', phone: '9876543212', source: 'local' },
  4: { villageId: 4, name: 'राजीव यादव', phone: '9876543213', source: 'local' },
  5: { villageId: 5, name: 'शरद कुमार', phone: '9876543214', source: 'local' },
  6: { villageId: 6, name: 'गीता सिंह', phone: '9876543215', source: 'local' },
  7: { villageId: 7, name: 'मोहन प्रसाद', phone: '9876543216', source: 'local' },
  8: { villageId: 8, name: 'प्रमोद सिंह', phone: '9876543217', source: 'local' },
  9: { villageId: 9, name: 'विजय कुमार', phone: '9876543218', source: 'local' },
  10: { villageId: 10, name: 'अजय सिंह', phone: '9876543219', source: 'local' },
};

/**
 * Fetch Pradhan data from data.gov.in LGD API
 */
async function fetchPradhanFromLGD(villageId: number): Promise<PradhanData | null> {
  try {
    console.log('[v0-PradhanService] Fetching from data.gov.in LGD API...');
    
    // LGD API endpoint for elected representatives
    const response = await Promise.race([
      fetch(`https://lgdweb.nic.in/api/villages/${villageId}`),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('LGD API timeout')), 5000)
      ),
    ]);

    if (!response.ok) throw new Error(`LGD API returned ${response.status}`);
    
    const data = await response.json();
    
    if (data.pradhan) {
      console.log('[v0-PradhanService] ✓ Got Pradhan data from LGD');
      return {
        villageId,
        name: data.pradhan.name,
        phone: data.pradhan.phone,
        email: data.pradhan.email,
        source: 'api',
      };
    }
  } catch (err) {
    console.log('[v0-PradhanService] LGD API failed:', (err as Error).message);
  }
  
  return null;
}

/**
 * Fetch Pradhan data from localbodydata.com
 */
async function fetchPradhanFromLocalBodyData(villageId: number, villageName: string): Promise<PradhanData | null> {
  try {
    console.log('[v0-PradhanService] Trying localbodydata.com...');
    
    const encodedName = encodeURIComponent(villageName);
    const response = await Promise.race([
      fetch(`https://localbodydata.com/api/villages/${encodedName}`),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('LocalBodyData timeout')), 5000)
      ),
    ]);

    if (response.ok) {
      const data = await response.json();
      if (data.sarpanch) {
        console.log('[v0-PradhanService] ✓ Got data from LocalBodyData');
        return {
          villageId,
          name: data.sarpanch.name,
          phone: data.sarpanch.phone,
          email: data.sarpanch.email,
          source: 'api',
        };
      }
    }
  } catch (err) {
    console.log('[v0-PradhanService] LocalBodyData failed:', (err as Error).message);
  }
  
  return null;
}

/**
 * Fetch Pradhan data from multiple sources with fallback
 */
export async function fetchPradhanData(villageId: number, villageName: string): Promise<PradhanData> {
  // Try APIs in sequence
  const apiSources = [
    () => fetchPradhanFromLGD(villageId),
    () => fetchPradhanFromLocalBodyData(villageId, villageName),
  ];

  for (const apiFunc of apiSources) {
    try {
      const result = await apiFunc();
      if (result) return result;
    } catch (err) {
      console.log('[v0-PradhanService] API attempt failed');
      continue;
    }
  }

  // Fallback to local data
  console.log('[v0-PradhanService] Using local fallback data');
  return (
    localPradhanData[villageId] || {
      villageId,
      name: 'जानकारी उपलब्ध नहीं',
      source: 'local',
    }
  );
}

/**
 * Batch fetch Pradhan data for multiple villages
 */
export async function fetchPradhanDataBatch(villages: Array<{ id: number; name: string }>): Promise<PradhanData[]> {
  console.log(`[v0-PradhanService] Fetching Pradhan data for ${villages.length} villages...`);
  
  const results = await Promise.all(
    villages.map(v => fetchPradhanData(v.id, v.name))
  );
  
  console.log('[v0-PradhanService] Batch fetch complete');
  return results;
}
