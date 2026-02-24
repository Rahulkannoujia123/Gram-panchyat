import { useState, useEffect } from 'react';
import { PradhanData, fetchPradhanData } from '../services/pradhanService';

interface UsePradhanDataReturn {
  pradhan: PradhanData | null;
  loading: boolean;
  error: string | null;
}

export function usePradhanData(villageId: number | undefined, villageName: string = ''): UsePradhanDataReturn {
  const [pradhan, setPradhan] = useState<PradhanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!villageId) {
      setPradhan(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchPradhanData(villageId, villageName);
        setPradhan(data);
        
        if (data.source === 'local') {
          setError('सरपंच की जानकारी अपडेट की जा रही है');
        }
      } catch (err) {
        console.error('[usePradhanData] Error:', err);
        setError('सरपंच की जानकारी लोड नहीं हो सकी');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [villageId, villageName]);

  return { pradhan, loading, error };
}
