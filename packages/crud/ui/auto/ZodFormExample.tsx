/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
import * as React from 'react';
// Since we're using Zod at runtime, we need to import it directly
import { z } from 'zod';
import { ZodForm, createTypedZodForm } from './ZodForm';

// Define a Zod schema for user data
const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  age: z
    .number()
    .min(18, { message: 'Must be at least 18 years old' })
    .optional(),
  role: z.enum(['admin', 'user', 'editor'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  bio: z
    .string()
    .max(200, { message: 'Bio must be less than 200 characters' })
    .optional(),
  newsletter: z.boolean().default(false),
  website: z.string().url({ message: 'Invalid URL' }).optional(),
});

// Create a type from the schema
type UserFormData = z.infer<typeof userSchema>;

// Create a typed form component for this specific schema
const UserForm = createTypedZodForm(userSchema);

export function ZodFormExample() {
  const [formData, setFormData] = React.useState<UserFormData | null>(null);

  // Handle form submission
  const handleSubmit = async (values: UserFormData) => {
    // In a real application, you would submit the data to an API
    console.log('Form submitted with values:', values);
    setFormData(values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // Define form layout
  const formLayout = {
    sections: [
      {
        title: 'Basic Information',
        description: 'Please provide your basic information',
        fields: ['name', 'email', 'age'],
        columns: 2 as const, // Use const assertion to fix the type issue
      },
      {
        title: 'Additional Information',
        fields: ['role', 'bio', 'website', 'newsletter'],
        columns: 2 as const, // Use const assertion to fix the type issue
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 font-bold text-2xl">
        User Registration Form with Zod Validation
      </h1>

      <div className="mb-8">
        <ZodForm
          schema={userSchema}
          initialValues={{
            name: '',
            email: '',
            role: 'user',
            newsletter: false,
          }}
          onSubmit={handleSubmit}
          layout={formLayout}
          submitLabel="Register"
          fieldOptions={{
            labels: {
              name: 'Full Name',
              email: 'Email Address',
              age: 'Age',
              role: 'User Role',
              bio: 'Biography',
              newsletter: 'Subscribe to Newsletter',
              website: 'Personal Website',
            },
            descriptions: {
              role: 'Select your role in the system',
              newsletter:
                'Receive updates about new features and announcements',
            },
            placeholders: {
              name: 'John Doe',
              email: 'john@example.com',
              bio: 'Tell us about yourself...',
              website: 'https://example.com',
            },
          }}
        />
      </div>

      {/* Alternative approach using the typed form component */}
      <div className="mt-12 border-gray-200 border-t pt-8">
        <h2 className="mb-6 font-bold text-xl">
          Alternative: Using Typed Form Component
        </h2>
        <UserForm
          initialValues={{
            name: '',
            email: '',
            role: 'editor',
            newsletter: true,
          }}
          onSubmit={handleSubmit}
          submitLabel="Submit"
        />
      </div>

      {/* Display submitted data */}
      {formData && (
        <div className="mt-8 rounded border border-green-300 bg-green-50 p-4">
          <h3 className="mb-2 font-semibold text-lg">Submitted Data:</h3>
          <pre className="overflow-auto rounded bg-white p-3">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
