import { useState, useEffect } from 'react';
import { PopulationData, fetchPopulationData } from '../services/populationService';

interface UsePopulationDataReturn {
  population: PopulationData | null;
  loading: boolean;
  error: string | null;
}

export function usePopulationData(villageId: number | undefined, villageName: string = ''): UsePopulationDataReturn {
  const [population, setPopulation] = useState<PopulationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!villageId) {
      setPopulation(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchPopulationData(villageId, villageName);
        setPopulation(data);
        
        if (data.source === 'local') {
          console.log('[usePopulationData] Using Census 2011 data');
        }
      } catch (err) {
        console.error('[usePopulationData] Error:', err);
        setError('जनसंख्या डेटा लोड नहीं हो सका');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [villageId, villageName]);

  return { population, loading, error };
}
