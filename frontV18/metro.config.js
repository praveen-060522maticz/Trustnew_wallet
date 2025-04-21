const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    transformer: {
        babelTransformerPath: require.resolve(
            "react-native-svg-transformer/react-native"
        )
    },
    resolver: {
        extraNodeModules: {
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer/"),
            process: require.resolve("process/browser"),
            crypto: require.resolve("crypto-browserify"),
        },
        assetExts: assetExts.filter((ext) => ext !== "svg"),
        sourceExts: [...sourceExts, "svg"]
    }
};

module.exports = mergeConfig(defaultConfig, config);