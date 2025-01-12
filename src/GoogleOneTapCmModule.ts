import { NativeModule, requireNativeModule } from "expo";

import { GoogleOneTapCmModuleEvents } from "./GoogleOneTapCm.types";

declare class GoogleOneTapCmModule extends NativeModule<GoogleOneTapCmModuleEvents> {
  login(): Promise<void>;
  loginWithButton(): Promise<void>;
  logout(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<GoogleOneTapCmModule>("GoogleOneTapCm");
