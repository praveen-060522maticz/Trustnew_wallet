export const EIP155_CHAINS = {
    '1': {
        id: 1,
        network: 'homestead',
        name: 'Ethereum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://cloudflare-eth.com',
        blockExplorer: 'https://etherscan.io',
    },
    '5': {
        id: 5,
        network: 'goerli',
        name: 'Ethereum Goerli',
        nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://rpc.ankr.com/eth_goerli',
        blockExplorer: 'https://goerli.etherscan.io',
    },
    '42161': {
        id: 42161,
        network: 'arbitrum',
        name: 'Arbitrum One',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        blockExplorer: 'https://arbiscan.io',
    },
    '43114': {
        id: 43114,
        network: 'avalanche',
        name: 'Avalanche',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
        rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
        blockExplorer: 'https://snowtrace.io',
    },
    '43113': {
        id: 43113,
        network: 'avalanche-fuji',
        name: 'Avalanche Fuji',
        nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
        rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
        blockExplorer: 'https://testnet.snowtrace.io',
    },
    '56': {
        id: 56,
        network: 'bsc',
        name: 'Binance Smart Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrl: 'https://rpc.ankr.com/bsc',
        blockExplorer: 'https://bscscan.com',
    },
    '97': {
        id: 97,
        network: 'bsc',
        name: 'Binance Smart Chain Test',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        rpcUrl: 'https://bsc-testnet.public.blastapi.io',
        blockExplorer: 'https://testnet.bscscan.com',
    },
    '250': {
        id: 250,
        network: 'fantom',
        name: 'Fantom',
        nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
        rpcUrl: 'https://rpc.ankr.com/fantom',
        blockExplorer: 'https://ftmscan.com',
    },
    '10': {
        id: 10,
        network: 'optimism',
        name: 'Optimism',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://mainnet.optimism.io',
        blockExplorer: 'https://optimistic.etherscan.io',
    },
    '11155420': {
        id: 11155420,
        network: 'optimism-sepholia',
        name: 'Optimism Sepholia',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://sepolia.optimism.io',
        blockExplorer: 'https://optimism-sepolia.blockscout.com',
    },
    '137': {
        id: 137,
        network: 'polygon',
        name: 'Polygon',
        nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
        rpcUrl: 'https://polygon-rpc.com',
        blockExplorer: 'https://polygonscan.com',
    },
    '80001': {
        id: 80001,
        network: 'mumbai',
        name: 'Polygon Mumbai',
        nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
        rpcUrl: 'https://rpc.ankr.com/polygon_mumbai',
        blockExplorer: 'https://mumbai.polygonscan.com',
    },
    '100': {
        id: 100,
        network: 'gnosis',
        name: 'Gnosis',
        nativeCurrency: { name: 'Gnosis', symbol: 'xDai', decimals: 18 },
        rpcUrl: 'https://rpc.gnosischain.com',
        blockExplorer: 'https://gnosis.blockscout.com',
    },
    '9001': {
        id: 9001,
        network: 'evmos',
        name: 'Evmos',
        nativeCurrency: { name: 'Evmos', symbol: 'EVMOS', decimals: 18 },
        rpcUrl: 'https://eth.bd.evmos.org:8545',
        blockExplorer: 'https://escan.live',
    },
    '324': {
        id: 324,
        network: 'zksync-era',
        name: 'zkSync Era',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://mainnet.era.zksync.io',
        blockExplorer: 'https://explorer.zksync.io',
    },
    '314': {
        id: 314,
        network: 'filecoin-mainnet',
        name: 'Filecoin Mainnet',
        nativeCurrency: { name: 'Filecoin', symbol: 'FIL', decimals: 18 },
        rpcUrl: 'https://api.node.glif.io/rpc/v1',
        blockExplorer: 'https://filscan.io',
    },
    '4689': {
        id: 4689,
        network: 'iotex',
        name: 'IoTeX',
        nativeCurrency: { name: 'IoTeX', symbol: 'IOTX', decimals: 18 },
        rpcUrl: 'https://babel-api.mainnet.iotex.io',
        blockExplorer: 'https://iotexscan.io',
    },
    '1088': {
        id: 1088,
        network: 'andromeda',
        name: 'Metis',
        nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
        rpcUrl: 'https://andromeda.metis.io/?owner=1088',
        blockExplorer: 'https://andromeda-explorer.metis.io',
    },
    '1284': {
        id: 1284,
        network: 'moonbeam',
        name: 'Moonbeam',
        nativeCurrency: { name: 'GLMR', symbol: 'GLMR', decimals: 18 },
        rpcUrl: 'https://moonbeam.public.blastapi.io',
        blockExplorer: 'https://moonscan.io',
    },
    '1285': {
        id: 1285,
        network: 'moonriver',
        name: 'Moonriver',
        nativeCurrency: { name: 'MOVR', symbol: 'MOVR', decimals: 18 },
        rpcUrl: 'https://moonriver.public.blastapi.io',
        blockExplorer: 'https://moonriver.moonscan.io',
    },
    '7777777': {
        id: 7777777,
        network: 'zora',
        name: 'Zora',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://rpc.zora.energy',
        blockExplorer: 'https://explorer.zora.energy',
    },
    '42220': {
        id: 42220,
        network: 'celo',
        name: 'Celo',
        nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
        rpcUrl: 'https://forno.celo.org',
        blockExplorer: 'https://explorer.celo.org/mainnet',
    },
    '8453': {
        id: 8453,
        network: 'base',
        name: 'Base',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://mainnet.base.org',
        blockExplorer: 'https://basescan.org',
    },
    '1313161554': {
        id: 1313161554,
        network: 'aurora',
        name: 'Aurora',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://mainnet.aurora.dev',
        blockExplorer: 'https://aurorascan.dev',
    },
    '11155111': {
        id: 11155111,
        network: 'sepolia',
        name: 'sepolia',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://sepolia.infura.io/v3/50c7d1be83794ae0a3e74eab40b74373',
        blockExplorer: 'https://sepolia.etherscan.io',
    },
    '80002': {
        id: 80002,
        network: 'amoy',
        name: 'Amoy',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrl: 'https://rpc-amoy.polygon.technology',
        blockExplorer: 'https://www.oklink.com/amoy',
    },
};

export const TRON_CHAINS = {
    '0x2b6653dc': {
        id: 0x2b6653dc,
        network: 'Tron',
        name: 'Tron',
        nativeCurrency: { name: 'TRON', symbol: 'TRX', decimals: 18 },
        rpcUrl: 'https://api.trongrid.io',
        blockExplorer: 'https://tronscan.org/#/',
    },
}

export const getRequestedChainList = (data) => {
    switch (data) {
        case "eip155":
            return EIP155_CHAINS;

        case "tron":
            return TRON_CHAINS;

        case "solana":
            return {
                id: "solana",
                network: 'Solana',
                name: 'Solana',
                nativeCurrency: { name: 'Solana', symbol: 'SOL', decimals: 18 },
                rpcUrl: 'https://api.mainnet-beta.solana.com',
                blockExplorer: 'https://solscan.io/',
            };

        default:
            return EIP155_CHAINS;
    }
}