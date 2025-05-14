// Example zod schema file
import { z } from 'zod';

export const userZodSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
