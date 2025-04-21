import { WalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';
import { ENV_PROJECT_ID } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BeatifyConsole } from './common';

export let walletKit;
console.log('ENV_RELAY_URL---->', ENV_PROJECT_ID);
export async function createWalletKit(relayerRegionURL) {
  // console.log('sasaswalletKitwalletKit---->', walletKit);
  // await createWallet()
  try {
    var core
    try {   
       core = new Core({
        projectId: ENV_PROJECT_ID,
        relayUrl: "wss://relay.walletconnect.org"
      });
    } catch (e) {
      console.log('Erri on core---->',e);
    }
console.log('coreada---->',core);
    try {
      walletKit = await WalletKit.init({
        core,
      });
    } catch (e) {
      console.log('Erron walkit---->',e);
    }
console.log('walletKit---->',walletKit);
    const clientId =
      await walletKit.engine.signClient.core.crypto.getClientId();
    console.log('WalletConnect ClientID: ', clientId);
    AsyncStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId);
    // return true
  } catch (error) {
    // return false
    console.error(
      'Failed to set WalletConnect clientId in localStorage: ',
      error,
    );
  }
}


export async function onAccountChange(address, chainId) {
  try {
    const sessions = walletKit?.getActiveSessions();
    if (!sessions) {
      return;
    }
    const namespace = chainId.split(':')[0];
    Object.values(sessions).forEach(async session => {
      await walletKit.updateSession({
        topic: session.topic,
        namespaces: {
          ...session.namespaces,
          [namespace]: {
            ...session.namespaces[namespace],
            accounts: [
              ...new Set(
                [`${chainId}:${address}`].concat(
                  Array.from(session.namespaces[namespace].accounts),
                ),
              ),
            ],
          },
        },
      });
      await new Promise(resolve => setTimeout(resolve, 1000));


      const accountsChanged = {
        topic: session.topic,
        event: {
          name: 'accountsChanged',
          data: [`${chainId}:${address}`],
        },
        chainId,
      };
      console.log('accountsChangedaccountsChangedaccountsChanged---->', accountsChanged);
      await walletKit.emitSessionEvent(accountsChanged);
    });
  } catch (e) {
    console.log('Error on account change---->', e);
  }
}
