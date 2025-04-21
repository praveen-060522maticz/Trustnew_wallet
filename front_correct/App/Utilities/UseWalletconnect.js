import { WalletConnectModal, useWalletConnectModal } from '@walletconnect/modal-react-native';

export const providerMetadata = {
    name: 'IGEM2E',
    description: 'Connect to IGE M2E',
  url: 'https://walletconnect.com/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'w3msample://',
  },
  
};

export const sessionParams = {
  namespaces: {
    eip155: {
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      chains: [`eip155:43113`],
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {},
    },
  },
};

const projectId = 'b421b23d9bb5cf02bf273b2a1183b2d8';



export const useWalletConnectModalV2 = ()=>{
    
    try{
    
        
        return(<WalletConnectModal projectId={projectId} providerMetadata={providerMetadata} sessionParams={sessionParams} />);
    }catch(err){
        console.log("errin v2",err);
    }
}

export const useAddress = () => {
    const { isOpen, open, close, provider, isConnected, address } = useWalletConnectModal();
    return {
        provider : provider,
        address: address
    }
}

export const useProvider = () => {
    const { isOpen, open, close, provider, isConnected, address } = useWalletConnectModal();
    return {
        provider : provider,
        isConnected: isConnected,
        address: address
    }

}

export const useWalletInfo = () => {
    const { isOpen, open, close, provider, isConnected, address } = useWalletConnectModal();
    return {
        isOpen, open, close, provider, isConnected, address
    }
}


