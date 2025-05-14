import { useEffect, useState } from "react";

export function useCan(resource: string, action: string, role: string) {
  const [can, setCan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate permission check
    const timer = setTimeout(() => {
      setCan(role === "admin" || role === "editor");
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [resource, action, role]);

  return { can, loading };
}

export function useHasRole(userRoles: string[], required: string | string[]) {
  if (Array.isArray(required)) {
    return required.some((role) => userRoles.includes(role));
  }
  return userRoles.includes(required);
}

export function usePermission(permissions: string[], required: string) {
  return permissions.includes(required);
}
