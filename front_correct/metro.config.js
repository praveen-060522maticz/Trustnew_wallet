// /**
//  * Metro configuration for React Native
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// const extraNodeModules = require('node-libs-browser');
// const { getDefaultConfig } = require("metro-config");

// // module.exports = {
// //   resolver: {
// //     extraNodeModules,
// //   },
// //   transformer: {
// //     getTransformOptions: async () => ({
// //       transform: {
// //         experimentalImportSupport: false,
// //         inlineRequires: true,
// //       },
// //     }),
// //   },
// // };
// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig();
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
   
//     },
//     resolver: {
//       assetExts: assetExts.filter(ext => ext !== 'svg'),
//       sourceExts: [...sourceExts, 'svg'],
//       extraNodeModules: require('node-libs-react-native')

//     },
//   };
// })();


const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
