'use client';

import * as React from 'react';

export default function App() {
  return (
    <iframe src="https://devtoolcafe.com/tools/rsa"
    style={{width: '100%', height: '100%', border:'0', overflow:'hidden'}}
     title="devtoolcafe RSA"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts" />
  );
}
