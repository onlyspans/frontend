import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { FieldGroup } from '@/shared/ui/field';
import { Form } from '@/shared/ui/form';
import {
  createProjectSchema,
  type CreateProjectFormData,
  useUpdateProject,
  useUploadProjectIcon
} from '@/entities/project';
import type { Project } from '@/entities/project';
import { toast } from 'sonner';
import { useTranslation } from '@/shared/lib/i18n';
import { ProjectNameField } from '@/features/project/creation/ui/project-name-field';
import { ProjectSlugField } from '@/features/project/creation/ui/project-slug-field';
import { ProjectDescriptionField } from '@/features/project/creation/ui/project-description-field';
import { ProjectIconField } from '@/features/project/creation/ui/project-icon-field';
import { DeployToField } from '@/features/project/creation/ui/deploy-to-field';
import { ProjectLifecycleField } from '@/features/project/creation/ui/project-lifecycle-field';
import { ProjectTagsField } from '@/features/project/creation/ui/project-tags-field';

interface ProjectSettingsGeneralFormProps {
  project: Project;
}

function projectToDefaultValues(project: Project): CreateProjectFormData {
  return {
    name: project.name,
    slug: project.slug,
    description: project.description ?? '',
    imageUrl: project.imageUrl ?? '',
    emoji: project.emoji ?? '',
    iconFile: undefined,
    deployTo: 'aws',
    lifecycleStages:
      project.lifecycleStages?.length > 0 ? project.lifecycleStages : ['development'],
    tagIds: project.tags?.map((t) => t.id) ?? []
  };
}

export function ProjectSettingsGeneralForm({ project }: ProjectSettingsGeneralFormProps) {
  const { t } = useTranslation();
  const updateMutation = useUpdateProject();
  const uploadIconMutation = useUploadProjectIcon();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: projectToDefaultValues(project)
  });

  useEffect(() => {
    form.reset(projectToDefaultValues(project));
  }, [project.id, project.updatedAt, form]);

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: project.id,
        data: {
          name: data.name,
          slug: data.slug?.trim() || data.slug,
          description: data.description,
          lifecycleStages: data.lifecycleStages,
          tagIds: data.tagIds ?? [],
          ...(!data.iconFile && {
            imageUrl: data.imageUrl?.trim() ?? '',
            emoji: data.emoji?.trim() ?? ''
          })
        }
      });
      if (data.iconFile) {
        await uploadIconMutation.mutateAsync({
          projectId: project.id,
          file: data.iconFile
        });
      }
      toast.success(t('project.settings.success'));
    } catch (error) {
      toast.error(t('project.settings.failed'), {
        description: error instanceof Error ? error.message : t('project.creation.unknownError')
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.settings.general')}</CardTitle>
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
                <Button
                  type="submit"
                  disabled={
                    form.formState.isSubmitting ||
                    updateMutation.isPending ||
                    uploadIconMutation.isPending
                  }
                >
                  {form.formState.isSubmitting ||
                  updateMutation.isPending ||
                  uploadIconMutation.isPending
                    ? t('project.settings.saving')
                    : t('project.settings.saveChanges')}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
