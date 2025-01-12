import { useEffect } from "react";

import GoogleOneTapCmModule from "./GoogleOneTapCmModule";

export const useAutoLogin = (onSuccess: () => void, onError: () => void) => {
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
    GoogleOneTapCmModule.login(true);
  }, []);
};
