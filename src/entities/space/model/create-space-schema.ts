import { z } from 'zod';

export const createSpaceSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Space name is required')
      .min(2, 'Space name must be at least 2 characters')
      .max(100, 'Space name must be less than 100 characters'),
    slug: z
      .string()
      .min(1, 'Space slug is required')
      .min(2, 'Space slug must be at least 2 characters')
      .max(50, 'Space slug must be less than 50 characters')
      .regex(
        /^[a-z0-9-_]+$/,
        'Slug can only contain lowercase letters, numbers, hyphens, and underscores'
      )
      .refine(
        (slug) => !slug.startsWith('-') && !slug.endsWith('-'),
        'Slug cannot start or end with a hyphen'
      )
      .refine(
        (slug) => !slug.startsWith('_') && !slug.endsWith('_'),
        'Slug cannot start or end with an underscore'
      ),
    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(150, 'Description must be less than 150 characters'),
    avatar: z
      .union([z.string().url(), z.literal('')])
      .optional(),
    avatarFile: z
      .instanceof(File, { message: 'File must be a valid image file' })
      .optional()
      .refine(
        (file) => !file || file.size <= 5 * 1024 * 1024,
        'File size must be less than 5MB'
      )
      .refine(
        (file) => !file || file.type.startsWith('image/'),
        'File must be an image'
      )
  });

export type CreateSpaceFormData = z.infer<typeof createSpaceSchema>;
