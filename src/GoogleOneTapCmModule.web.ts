import { registerWebModule, NativeModule } from 'expo';

import { GoogleOneTapCmModuleEvents } from './GoogleOneTapCm.types';

class GoogleOneTapCmModule extends NativeModule<GoogleOneTapCmModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(GoogleOneTapCmModule);
