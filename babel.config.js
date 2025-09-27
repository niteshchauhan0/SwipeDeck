module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // other plugins (if any)
      // no 'react-native-reanimated/plugin' here if reanimated removed
    ].filter(Boolean),
  };
};
