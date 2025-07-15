/**
 * SPDX-License-Identifier: MIT
 */

import type { FC, ReactNode } from 'react';

interface ToolbarProps {
  children?: ReactNode;
}

export const Toolbar: FC<ToolbarProps> = ({ children }) => {
  return (
    <div
      className="basehub-toolbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </div>
  );
};
