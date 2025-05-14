import React from "react";

type CanAccessProps = {
  can: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export const CanAccess: React.FC<CanAccessProps> = ({ can, fallback = null, children }) => {
  return <>{can ? children : fallback}</>;
};
