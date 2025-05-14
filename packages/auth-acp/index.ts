export type AccessRule = {
  resource: string;
  action: string;
  roles: string[];
};

export type CanParams = {
  resource: string;
  action: string;
  role: string;
};

export const createAccessControlProvider = ({ rules }: { rules: AccessRule[] }) => {
  return {
    can: ({ resource, action, role }: CanParams): boolean => {
      return rules.some(
        (rule) =>
          rule.resource === resource &&
          rule.action === action &&
          rule.roles.includes(role)
      );
    },
  };
};
