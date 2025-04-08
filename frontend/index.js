/**
 * @format
 */
import './shim'
import '@walletconnect/react-native-compat'
import 'react-native-get-random-values'
import 'node-libs-react-native/globals';
import '@ethersproject/shims';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import crypto from 'react-native-crypto';
import { Provider } from 'react-redux';
import configureStore from './App/Redux/store';

const polyfillDigest = async (algorithm, data) => {
  const algo = algorithm.replace('-', '').toLowerCase();
  const hash = crypto.createHash(algo);
  hash.update(data);
  return hash.digest();
};


// eslint-disable-next-line no-undef
globalThis.crypto = crypto;
// eslint-disable-next-line no-undef
globalThis.crypto.subtle = {
  digest: polyfillDigest,
};

const store = configureStore();

const Root = () => (
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
);

AppRegistry.registerComponent(appName, () => Root);
