import { cva, type VariantProps } from 'class-variance-authority';

import type { Project } from '../model/project';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { cn } from '@/shared/lib/utils';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const projectIconRadiusMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
  none: 'rounded-none'
} as const;

const projectIconRadiusVariants = cva('', {
  variants: {
    radius: projectIconRadiusMap
  },
  defaultVariants: {
    radius: 'sm'
  }
});

const projectIconRootVariants = cva(
  'relative flex shrink-0 overflow-hidden',
  {
    variants: {
      size: {
        sm: 'size-6',
        md: 'size-8',
        lg: 'size-12',
        xl: 'size-16',
        '2xl': 'size-20'
      },
      radius: projectIconRadiusMap
    },
    defaultVariants: {
      size: 'md',
      radius: 'sm'
    }
  }
);

const projectIconLabelVariants = cva('font-medium', {
  variants: {
    labelScale: {
      xxs: 'text-[0.6rem]',
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    }
  }
});

type RootVariantProps = VariantProps<typeof projectIconRootVariants>;
type LabelResolvedScale = NonNullable<
  VariantProps<typeof projectIconLabelVariants>['labelScale']
>;

export type ProjectIconSize = NonNullable<RootVariantProps['size']>;
export type ProjectIconRadius = NonNullable<RootVariantProps['radius']>;
export type ProjectIconLabelScale = 'auto' | LabelResolvedScale;

const DEFAULT_PROJECT_ICON_SIZE = 'md' satisfies ProjectIconSize;

const PROJECT_ICON_LABEL_BY_SIZE: Record<
  ProjectIconSize,
  { initials: LabelResolvedScale; emoji: LabelResolvedScale }
> = {
  sm: { initials: 'xxs', emoji: 'xs' },
  md: { initials: 'xs', emoji: 'base' },
  lg: { initials: 'base', emoji: '2xl' },
  xl: { initials: 'xl', emoji: '3xl' },
  '2xl': { initials: '2xl', emoji: '4xl' }
};

export interface ProjectIconProps {
  project: Pick<Project, 'name' | 'imageUrl' | 'emoji'>;
  size?: ProjectIconSize;
  radius?: ProjectIconRadius;
  labelScale?: ProjectIconLabelScale;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export function ProjectIcon({
  project,
  size,
  radius,
  labelScale = 'auto',
  onImageLoad,
  onImageError
}: ProjectIconProps) {
  const resolvedSize = size ?? DEFAULT_PROJECT_ICON_SIZE;
  const root = projectIconRootVariants({ size: resolvedSize, radius });
  const rounded = projectIconRadiusVariants({ radius });
  const bySize = PROJECT_ICON_LABEL_BY_SIZE[resolvedSize];
  const resolvedLabelScale =
    labelScale === 'auto'
      ? project.emoji
        ? bySize.emoji
        : bySize.initials
      : labelScale;
  const label = projectIconLabelVariants({ labelScale: resolvedLabelScale });

  return (
    <Avatar className={root}>
      {project.imageUrl ? (
        <AvatarImage
          src={project.imageUrl}
          alt=""
          className={cn('aspect-square size-full object-cover', rounded)}
          onLoad={onImageLoad}
          onError={onImageError}
        />
      ) : null}
      <AvatarFallback className={cn(label, rounded)} aria-hidden>
        {project.emoji ?? getInitials(project.name)}
      </AvatarFallback>
    </Avatar>
  );
}
