import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "expo/config-plugins";

const withWebClientId: ConfigPlugin<{ webClientId: string }> = (
  config,
  { webClientId }
) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "webClientId",
      webClientId
    );
    return config;
  });
  return config;
};

export default withWebClientId;
