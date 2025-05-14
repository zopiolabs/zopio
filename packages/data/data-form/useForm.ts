import { useEffect, useState } from "react";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

type UseFormParams<T> = {
  resource: string;
  id?: number | string;
  action: "edit" | "create";
  onSubmit: (data: T) => Promise<unknown>;
  schema?: ZodSchema<T>;
};

export function useForm<T extends Record<string, unknown>>({
  resource,
  id,
  action,
  onSubmit,
  schema,
}: UseFormParams<T>) {
  const [formValues, setFormValues] = useState<Partial<T>>({});
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<Error | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (action === "edit" && id !== undefined) {
      setFormLoading(true);
      fetch(`/api/${resource}/${id}`)
        .then((res) => res.json())
        .then((data) => setFormValues(data))
        .catch((err) => setFormError(err))
        .finally(() => setFormLoading(false));
    }
  }, [resource, id, action]);

  const handleChange = (field: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Process validation errors from Zod
   */
  const processValidationErrors = (err: ZodError) => {
    const errors: Record<string, string> = {};
    for (const e of err.errors) {
      if (e.path[0]) {
        errors[e.path[0] as string] = e.message;
      }
    }
    setFormErrors(errors);
  };

  /**
   * Validate form data using the provided schema
   */
  const validateForm = () => {
    if (schema) {
      schema.parse(formValues);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    try {
      setFormLoading(true);
      setFormErrors({});
      
      // Validate the form data
      validateForm();
      
      // Submit the form data
      await onSubmit(formValues as T);
    } catch (err) {
      if (err instanceof ZodError) {
        processValidationErrors(err);
      } else {
        setFormError(err as Error);
      }
    } finally {
      setFormLoading(false);
    }
  };

  return {
    formValues,
    formErrors,
    formLoading,
    formError,
    handleChange,
    handleSubmit,
  };
}
