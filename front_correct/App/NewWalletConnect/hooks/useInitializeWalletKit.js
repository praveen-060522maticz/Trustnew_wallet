import { useCallback, useEffect, useRef, useState } from 'react';
import { createWalletKit } from '../utils/WalletConnectUtills';

export default function useInitializeWalletKit() {
  const [initialized, setInitialized] = useState(false);
  console.log('segsegesgewinitialized---->', initialized);
  const onInitialize = useCallback(async () => {
    try {
      await createWalletKit();
      setInitialized(true);
    } catch (err) {
      console.log("adaewda",err);
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
  }, [initialized, onInitialize]);

  return initialized;
}
