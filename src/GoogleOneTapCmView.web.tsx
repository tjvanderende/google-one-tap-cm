import * as React from 'react';

import { GoogleOneTapCmViewProps } from './GoogleOneTapCm.types';

export default function GoogleOneTapCmView(props: GoogleOneTapCmViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
