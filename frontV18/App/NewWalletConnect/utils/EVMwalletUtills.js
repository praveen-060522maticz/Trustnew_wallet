// const { providers, Wallet } = require('ethers');

// /**
//  * Library
//  */
// class EIP155Lib {
//   constructor(wallet) {
//     this.wallet = wallet;
//   }

//   static init({ mnemonic, privateKey }) {
//     let wallet;

//     if (mnemonic) {
//       wallet = Wallet.fromMnemonic(mnemonic);
//     } else if (privateKey) {
//       wallet = new Wallet(privateKey);
//     } else {
//       wallet = Wallet.createRandom();
//     }

//     return new EIP155Lib(wallet);
//   }

//   getMnemonic() {
//     return this.wallet.mnemonic?.phrase || null; // Returns null if private key was used
//   }

//   getPrivateKey() {
//     return this.wallet.privateKey;
//   }

//   getAddress() {
//     return this.wallet.address;
//   }

//   signMessage(message) {
//     return this.wallet.signMessage(message);
//   }

//   _signTypedData(domain, types, data) {
//     return this.wallet._signTypedData(domain, types, data);
//   }

//   connect(provider) {
//     return this.wallet.connect(provider);
//   }

//   signTransaction(transaction) {
//     return this.wallet.signTransaction(transaction);
//   }
// }

// module.exports = EIP155Lib;


const { HDNodeWallet, Wallet, Mnemonic } = require('ethers');

/**
 * Library
 */
class EIP155Lib {
  constructor(wallet) {
    this.wallet = wallet;
  }

  static init({ mnemonic, privateKey }) {
    let wallet;

    if (mnemonic) {
      const mnemonicObj = Mnemonic.fromPhrase(mnemonic);
      wallet = HDNodeWallet.fromMnemonic(mnemonicObj);
    } else if (privateKey) {
      wallet = new Wallet(privateKey);
    } else {
      wallet = Wallet.createRandom();
    }

    return new EIP155Lib(wallet);
  }

  getMnemonic() {
    return this.wallet.mnemonic?.phrase || null;
  }

  getPrivateKey() {
    return this.wallet.privateKey;
  }

  getAddress() {
    return this.wallet.address;
  }

  async signMessage(message) {
    return await this.wallet.signMessage(message);
  }

  async signTypedData(domain, types, data) {
    return await this.wallet.signTypedData(domain, types, data);
  }

  connect(provider) {
    return new EIP155Lib(this.wallet.connect(provider));
  }

  async signTransaction(transaction) {
    const signedTx = await this.wallet.signTransaction(transaction);
    return signedTx;
  }
}

module.exports = EIP155Lib;
