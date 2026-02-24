import { useState, useEffect } from 'react';
import { Village } from '../types';
import { villagesData as fallbackVillagesData } from '../data';
import { fetchVillagesFromAPIs } from '../services/villageService';

interface UseVillagesReturn {
  villages: Village[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVillages(): UseVillagesReturn {
  const [villages, setVillages] = useState<Village[]>(fallbackVillagesData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVillages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch from external APIs
      const apiVillages = await fetchVillagesFromAPIs();
      
      if (apiVillages && apiVillages.length > 0) {
        console.log('[useVillages] Using API data:', apiVillages.length, 'villages');
        setVillages(apiVillages);
      } else {
        // Fallback to local data
        console.log('[useVillages] Using fallback local data');
        setVillages(fallbackVillagesData);
        setError('बाहरी API उपलब्ध नहीं है, स्थानीय डेटा का उपयोग किया जा रहा है');
      }
    } catch (err) {
      console.error('[useVillages] Error:', err);
      // Fallback to local data
      setVillages(fallbackVillagesData);
      setError('डेटा लोड नहीं हो सका, स्थानीय डेटा का उपयोग किया जा रहा है');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  return { villages, loading, error, refetch: fetchVillages };
}
