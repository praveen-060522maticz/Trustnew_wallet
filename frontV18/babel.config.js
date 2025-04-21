
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  overrides: [
    {
      test: './node_modules/ethers',
      plugins: [
        '@babel/plugin-proposal-private-property-in-object',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods'
      ]
    }
  ],
    plugins: [
    [
      "module:react-native-dotenv",
      {
        // envName: "MY_ENV",
        moduleName: "@env",
        path: ".env",
        "safe": true,
        "allowUndefined": true
      },
    ],
   
  ]

};