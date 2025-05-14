# @repo/data-form (with Zod)

Composable `useForm` hook for Zopio, extended with Zod validation.

## Features

- Auto-load form data
- Zod-based validation
- Tracks loading, errors, form state

## Usage

```tsx
const { formValues, formErrors, handleChange, handleSubmit } = useForm({
  resource: "users",
  action: "create",
  schema: z.object({
    email: z.string().email(),
    name: z.string().min(3),
  }),
  onSubmit: async (data) => await dataProvider.create({ resource: "users", variables: data }),
});
```
