/**
 * SPDX-License-Identifier: MIT
 */

import type { FC, ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout: FC<RootLayoutProperties> = ({ children }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
