# @repo/auth-ui

React UI components for access control in Zopio framework.

## Components

- `<CanAccess />`: Conditionally render children based on access
- `<RequireRole />`: Conditionally render children based on user roles

## Usage

```tsx
<CanAccess
  can={user?.role === "admin"}
  fallback={<p>Access Denied</p>}
>
  <SecretComponent />
</CanAccess>
```
