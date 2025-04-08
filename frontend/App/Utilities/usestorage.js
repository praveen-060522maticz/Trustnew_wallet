import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()


export const setNavigation = (value) => {
    return storage.set('from', JSON.stringify(value));
}
export const getNavigation = (value) => {
    return storage.getString('from')
}

//selected index
export const SetCurrentIndex = (index) => {
    storage.set("CURRENT_WALLET_INDEX", (index));

}
export const GetCurrentIndex = () => {
    const wallet = storage.getNumber('CURRENT_WALLET_INDEX');
    return parseInt(wallet);

}
export const AddWallet = (wallet) => {
    var wallets = UseWalletArray();
    var index = wallets.length;
    if (!wallets || wallets.length == 0) wallets = [];
    wallets.push(wallet);
    SetWallets(wallets);
    return index;
}
//walletdetails

export const Deletewallet = () => {
    storage.delete('WALLETS');
}
export const CurrentWalletArray = () => {
    try {
        const wallet = JSON.parse(storage.getString('CurrentWALLETS'));
        return wallet || [];
    }
    catch (e) {
        return [];
    }
}

export const UseWalletArray = () => {
    try {
        const wallet = JSON.parse(storage.getString('WALLETS'));
        return wallet || [];
    }
    catch (e) {
        return [];
    }
}
export const SetWallets = (wallets) => {
    storage.set('WALLETS', JSON.stringify(wallets));
}
export const Setcurrentwallet = (wallets) => {

    storage.set('CurrentWALLETS', JSON.stringify(wallets));
}





//pascodestatus
export const Getpasscodestataus = () => {
    return (storage.getString('PASSCODE'));
}

export const SetPasscode = (data) => {
    storage.set("PASSCODE", (data));
}
//biomatric
export const GetBiomatricstataus = () => {
    return (storage.getBoolean('Biomatric'));
}

export const SetBiomatricstataus = (data) => {
    storage.set('Biomatric', (data));
}

export const GetDefaultcurrencies = () => {
    return (storage.getString('Currencies'));
}

export const setdefaultcurrencies = (value) => {
    return storage.set('Currencies', JSON.stringify(value));
}

//
export const Setpasscodestatus = (data) => {
    storage.set("PASSCODESTATUS", (data));
}
export const GetStatauspasscode = () => {
    return (storage.getBoolean('PASSCODESTATUS'));
}


export const Setchoosednetwork = (data) => {
    storage.set("Choosednetwork", (data));
}

//Dapp 
export const SetDapp = (data) => {
    storage.set("Dapps", (data));
}
export const GetDapp = () => {
    return (storage.getBoolean('Dapps'));
}

//Pushnotofifactionsatatus
export const SetNotifiactionstatus = (data) => {
    storage.set("NotifiactionStataus", (data));
}
export const GetNotifiactionstatus = () => {
    return (storage.getBoolean('NotifiactionStataus'));
}
//Modelvisible
export const SetModel = (data) => {
    storage.set("Model", (data));
}
export const GetModel = () => {
    return (storage.getBoolean('Model'));
}
//JWT token
export const SetJWTtoken = (data) => {
    storage.set("JWTtoken", (data));
}
export const GetJWTtoken = () => {
    return (storage.getString('JWTtoken'));
}


export const Setmobiletheme = (data) => {
    storage.set("mobiletheme", (data));
}

export const Getmobiletheme = () => {
    return (storage.getString('mobiletheme'));
}



export const SetTronbalance = (data) => {
    storage.set("Tronbalance", (data));
}

export const GetTronbalance = () => {
    return (storage.getString('Tronbalance'));
}
export const SetTronsendstatus = (data) => {
    storage.set("Tronsendstatus", (data));
}
export const GetTronsendstatus = () => {
    return (storage.getBoolean('Tronsendstatus'));
}
export const SetTronsendamount = (data) => {
    storage.set("Tronsendamount", (data));
}
export const GetTronsendamount = () => {
    return (storage.getString('Tronsendamount'));
}
export const SetCurrentTronbalance = (data) => {
    storage.set("CurrentTronbalance", (data));
}

export const GetCurretntTronbalance = () => {
    return (storage.getString('CurrentTronbalance'));
}