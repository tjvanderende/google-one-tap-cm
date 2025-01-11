import { requireNativeView } from 'expo';
import * as React from 'react';

import { GoogleOneTapCmViewProps } from './GoogleOneTapCm.types';

const NativeView: React.ComponentType<GoogleOneTapCmViewProps> =
  requireNativeView('GoogleOneTapCm');

export default function GoogleOneTapCmView(props: GoogleOneTapCmViewProps) {
  return <NativeView {...props} />;
}
