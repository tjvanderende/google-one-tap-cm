import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleOneTapCmModule from "google-one-tap-cm";
import { useEffect } from "react";
import { loggedInUsingButtonKey } from "../constants";

/**
 * This hook will automatically login the user if they have already logged in with Google One Tap.
 * If user has logged in before using the Google One Tap button, it will attempt to login the user automatically.
 * Otherwise, it will login the user.
 * @param onSuccess - Callback function that will be called if the user is successfully logged in.
 * @param onError - Callback function that will be called if the user is not successfully logged in.
 */
export const useAutoLogin = (onSuccess: () => void, onError: () => void) => {
  const loggedInUsingButton = async () => {
    const loggedInUsingButton = await AsyncStorage.getItem(
      loggedInUsingButtonKey
    );
    return loggedInUsingButton === "true";
  };

  useEffect(() => {
    const subscription = GoogleOneTapCmModule.addListener(
      "onLogin",
      (payload) => {
        if (payload.success) {
          onSuccess();
        } else {
          onError();
        }
      }
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    loggedInUsingButton().then((loggedInUsingButton) => {
      GoogleOneTapCmModule.login(loggedInUsingButton);
    });
  }, []);
};
