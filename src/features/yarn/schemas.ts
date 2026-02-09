import { z } from 'zod';

export const YARN_CATEGORIES = [
  'LACE',
  'FINGERING',
  'SPORT',
  'DK',
  'WORSTED',
  'ARAN',
  'BULKY',
  'SUPER_BULKY',
] as const;

export const yarnFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  brand: z.string().max(100, 'Brand must be 100 characters or less').optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Must be a valid hex color (e.g., #FF5733)')
    .optional()
    .or(z.literal('')),
  category: z.enum(YARN_CATEGORIES, { required_error: 'Category is required' }),
  weightInGrams: z.coerce.number().positive('Must be positive').optional().or(z.literal('')),
  lengthInMeters: z.coerce.number().positive('Must be positive').optional().or(z.literal('')),
  fiberContent: z.string().max(200, 'Fiber content must be 200 characters or less').optional(),
  quantity: z.coerce.number().int('Must be a whole number').min(1, 'Minimum quantity is 1'),
  pricePerUnit: z.coerce.number().positive('Must be positive').optional().or(z.literal('')),
  currencyCode: z.string().length(3, 'Currency code must be 3 characters').optional(),
});

export type YarnFormData = z.infer<typeof yarnFormSchema>;
