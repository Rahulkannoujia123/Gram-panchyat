import { useState, useEffect } from 'react';
import { Village } from '../types';
import { pindraVillages } from '../data/pindraVillages';
import { fetchVillagesFromAPIs } from '../services/villageService';

interface UseVillagesReturn {
  villages: Village[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVillages(): UseVillagesReturn {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVillages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[v0] useVillages: Fetching Pindra block villages...');
      // Fetch from APIs (will fallback to pindraVillages internally)
      const apiVillages = await fetchVillagesFromAPIs();
      
      console.log('[v0] useVillages: Loaded', apiVillages.length, 'villages');
      setVillages(apiVillages);
      
      // Show info about data source
      const isAPIData = apiVillages.length !== pindraVillages.length;
      if (isAPIData) {
        console.log('[v0] useVillages: Using external API data');
      } else {
        console.log('[v0] useVillages: Using verified local Pindra data - 104 gram panchayats');
      }
    } catch (err) {
      console.error('[v0] useVillages Error:', err);
      // Emergency fallback
      setVillages(pindraVillages);
      setError('डेटा लोड करने में त्रुटि - स्थानीय डेटा का उपयोग किया जा रहा है');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  return { villages, loading, error, refetch: fetchVillages };
}
