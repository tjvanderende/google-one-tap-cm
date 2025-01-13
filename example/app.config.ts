import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "google-one-tap-cm-example",
  slug: "google-one-tap-cm-example",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  scheme: "googleonetapcmexample",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "expo.modules.googleonetapcm.example",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "expo.modules.googleonetapcm.example",
  },
  plugins: [
    [
      "../app.plugin.js",
      {
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      },
    ],
    "expo-router",
  ],
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
};

export default config;
