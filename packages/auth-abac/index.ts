export type AttributePolicy = Record<string, string[]>;
export type UserAttributes = Record<string, string | number | boolean>;

export function checkAttributes(user: UserAttributes, policy: AttributePolicy): boolean {
  return Object.entries(policy).every(([key, allowedValues]) => {
    const userValue = user[key];
    return allowedValues.includes(String(userValue));
  });
}
