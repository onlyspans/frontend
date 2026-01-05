import { z } from 'zod';

export const deployToOptions = ['aws', 'yandex-cloud', 'kubernetes'] as const;

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Project name is required')
      .min(2, 'Project name must be at least 2 characters')
      .max(100, 'Project name must be less than 100 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(300, 'Description must be less than 300 characters'),
    avatar: z
      .string()
      .optional()
      .refine(
        (val) => !val || val === '' || val.startsWith('http://') || val.startsWith('https://') || /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]$/u.test(val),
        'Avatar must be a valid URL or a single emoji'
      ),
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
      ),
    deployTo: z.enum(deployToOptions),
    lifecycleId: z.string().min(1, 'Please select a project lifecycle')
  });

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
