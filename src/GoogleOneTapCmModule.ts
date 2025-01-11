import { NativeModule, requireNativeModule } from 'expo';

import { GoogleOneTapCmModuleEvents } from './GoogleOneTapCm.types';

declare class GoogleOneTapCmModule extends NativeModule<GoogleOneTapCmModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<GoogleOneTapCmModule>('GoogleOneTapCm');
