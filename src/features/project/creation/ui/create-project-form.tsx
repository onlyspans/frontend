import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { FieldGroup } from '@/shared/ui/field';
import { Form } from '@/shared/ui/form';
import {
  createProjectSchema,
  type CreateProjectFormData,
  useCreateProject,
  useUploadProjectIcon
} from '@/entities/project';
import { nameToSlug } from '@/shared/lib';
import { toast } from 'sonner';
import { ProjectNameField } from './project-name-field';
import { ProjectSlugField } from './project-slug-field';
import { ProjectDescriptionField } from './project-description-field';
import { ProjectIconField } from './project-icon-field';
import { DeployToField } from './deploy-to-field';
import { ProjectLifecycleField } from './project-lifecycle-field';
import { ProjectTagsField } from './project-tags-field';
import { useNavigate } from 'react-router-dom';
import { useSpaceUrl } from '@/shared/hooks/use-space-url.ts';
import { useTranslation } from '@/shared/lib/i18n';

interface CreateProjectFormProps {
  className?: string;
}

export function CreateProjectForm({ className }: CreateProjectFormProps) {
  const navigate = useNavigate();
  const { getSpaceUrl } = useSpaceUrl();
  const { t } = useTranslation();
  const createProjectMutation = useCreateProject();
  const uploadIconMutation = useUploadProjectIcon();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      emoji: '',
      iconFile: undefined,
      deployTo: 'aws',
      lifecycleStages: ['development'],
      tagIds: []
    }
  });

  const name = form.watch('name');
  const slugDirty = form.formState.dirtyFields.slug;
  useEffect(() => {
    if (slugDirty) return;
    form.setValue('slug', nameToSlug(name));
  }, [name, slugDirty, form]);

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const slug =
        data.slug?.trim() || nameToSlug(data.name) || 'project';
      const project = await createProjectMutation.mutateAsync({
        name: data.name,
        slug,
        description: data.description,
        ...(!data.iconFile && data.imageUrl?.trim() && { imageUrl: data.imageUrl.trim() }),
        ...(!data.iconFile && data.emoji?.trim() && { emoji: data.emoji.trim() }),
        status: 'active',
        lifecycleStages: data.lifecycleStages,
        tagIds: data.tagIds?.length ? data.tagIds : undefined
      });
      if (data.iconFile) {
        try {
          await uploadIconMutation.mutateAsync({
            projectId: project.id,
            file: data.iconFile
          });
        } catch (iconError) {
          toast.error(t('project.creation.failedToLoadImage'), {
            description: iconError instanceof Error ? iconError.message : undefined
          });
        }
      }
      toast.success(t('project.creation.success'));
      navigate(getSpaceUrl('/'));
    } catch (error) {
      toast.error(t('project.creation.failed'), {
        description: error instanceof Error ? error.message : t('project.creation.unknownError')
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('project.creation.title')}</CardTitle>
        <CardDescription>
          {t('project.creation.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <ProjectIconField form={form} />
              <ProjectNameField form={form} />
              <ProjectSlugField form={form} />
              <ProjectDescriptionField form={form} />
              <DeployToField form={form} />
              <ProjectLifecycleField form={form} />
              <ProjectTagsField form={form} />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || createProjectMutation.isPending || uploadIconMutation.isPending}
                >
                  {form.formState.isSubmitting || createProjectMutation.isPending || uploadIconMutation.isPending
                    ? t('project.creation.creating')
                    : t('project.creation.create')}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

