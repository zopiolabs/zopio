# @addon/inferencer

Auto-generate form and table UIs from JSON records in Zopio.

## Features

- `inferSchemaFromRecord()` - type guessing from a record
- `<InferForm />` - auto-rendered form
- `<InferTable />` - auto-rendered table

## Example

```tsx
const schema = inferSchemaFromRecord({ name: "John", age: 30, active: true });

<InferForm schema={schema} value={formData} onChange={setFormData} />
<InferTable schema={schema} data={[formData]} />
```
