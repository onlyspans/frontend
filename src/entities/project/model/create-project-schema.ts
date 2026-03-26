import { z } from 'zod';

export const deployToOptions = ['aws', 'yandex-cloud', 'kubernetes'] as const;

const slugSchema = z
  .string()
  .max(255, 'Slug must be at most 255 characters')
  .refine(
    (val) => !val || /^[a-z0-9-]+$/.test(val),
    'Slug can only contain lowercase letters, numbers and hyphens'
  )
  .refine(
    (val) => !val || (val.length >= 1 && !val.startsWith('-') && !val.endsWith('-')),
    'Slug cannot start or end with a hyphen'
  );

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .min(2, 'Project name must be at least 2 characters')
      .max(100, 'Project name must be less than 100 characters'),
    slug: slugSchema,
    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(300, 'Description must be less than 300 characters'),
    imageUrl: z
      .string()
      .max(2048, 'URL must be at most 2048 characters')
      .optional()
      .refine(
        (val) => !val || val.trim() === '' || /^https?:\/\/.+/.test(val),
        'Image URL must be a valid HTTP(S) URL'
      ),
    emoji: z
      .string()
      .max(20, 'Emoji must be at most 20 characters')
      .optional(),
    iconFile: z
      .instanceof(File, { message: 'Must be a valid file' })
      .optional()
      .refine((file) => !file || file.size <= 2 * 1024 * 1024, 'File size must be at most 2 MB')
      .refine(
        (file) =>
          !file ||
          ['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type),
        'Allowed formats: PNG, JPEG, GIF, WebP'
      ),
    deployTo: z.enum(deployToOptions),
    environmentIds: z.array(z.string().uuid()).min(1, 'Select at least one environment'),
    tagIds: z.array(z.string().uuid())
  });

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
