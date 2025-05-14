import React from "react";

type RequireRoleProps = {
  userRoles: string[];
  required: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export const RequireRole: React.FC<RequireRoleProps> = ({
  userRoles,
  required,
  fallback = null,
  children,
}) => {
  const hasRole = Array.isArray(required)
    ? required.some((role) => userRoles.includes(role))
    : userRoles.includes(required);

  return <>{hasRole ? children : fallback}</>;
};
