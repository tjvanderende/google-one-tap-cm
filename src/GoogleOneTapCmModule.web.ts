import { registerWebModule, NativeModule } from "expo";

import {
  GoogleOneTapCmModuleEvents,
  GoogleOneTapCmType,
} from "./GoogleOneTapCm.types";

class GoogleOneTapCmModule extends NativeModule<GoogleOneTapCmModuleEvents> {
  login() {
    this.emit("onLogin", {
      success: true,
      type: GoogleOneTapCmType.PUBLIC_KEY,
      successBody: {
        publicKey: "123",
      },
    });
  }

  logout() {
    this.emit("onLogout", {
      success: true,
    });
  }
}

export default registerWebModule(GoogleOneTapCmModule);
