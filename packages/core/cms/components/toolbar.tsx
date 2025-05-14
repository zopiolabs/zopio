import type { ReactNode } from 'react';

// Create a custom Toolbar component to replace the basehub Toolbar component
type ToolbarProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

export function Toolbar({ children, ...props }: ToolbarProps) {
  // This is a temporary replacement for the basehub Toolbar component
  return (
    <div className="basehub-toolbar" {...props}>
      {children}
    </div>
  );
}
