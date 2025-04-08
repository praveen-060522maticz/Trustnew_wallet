const { providers, Wallet } = require('ethers');

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
      wallet = Wallet.fromMnemonic(mnemonic);
    } else if (privateKey) {
      wallet = new Wallet(privateKey);
    } else {
      wallet = Wallet.createRandom();
    }

    return new EIP155Lib(wallet);
  }

  getMnemonic() {
    return this.wallet.mnemonic?.phrase || null; // Returns null if private key was used
  }

  getPrivateKey() {
    return this.wallet.privateKey;
  }

  getAddress() {
    return this.wallet.address;
  }

  signMessage(message) {
    return this.wallet.signMessage(message);
  }

  _signTypedData(domain, types, data) {
    return this.wallet._signTypedData(domain, types, data);
  }

  connect(provider) {
    return this.wallet.connect(provider);
  }

  signTransaction(transaction) {
    return this.wallet.signTransaction(transaction);
  }
}

module.exports = EIP155Lib;
