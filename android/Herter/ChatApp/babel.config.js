module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Your other Babel plugins go here, if you have any.
    // For example, if you're using React Native Web:
    // 'react-native-web',

    // This plugin MUST be the last one in the plugins array.
    'react-native-reanimated/plugin',
  ],
};