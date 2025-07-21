// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin', // This line is crucial and MUST be the last plugin
  ],
};