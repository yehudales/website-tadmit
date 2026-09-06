import { useState, useEffect } from 'react';
import { getStoreStatus, StoreCountdown } from '../utils/storeStatus';

export function useStoreStatus(): StoreCountdown {
  const [status, setStatus] = useState<StoreCountdown>(() => getStoreStatus());

  useEffect(() => {
    // Initial sync
    setStatus(getStoreStatus());

    const interval = setInterval(() => {
      setStatus(getStoreStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return status;
}
