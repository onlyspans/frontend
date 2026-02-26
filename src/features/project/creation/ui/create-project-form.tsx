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
import { toast } from 'sonner';
import { ProjectNameField } from './project-name-field';
import { ProjectDescriptionField } from './project-description-field';
import { ProjectIconField } from './project-icon-field';
import { DeployToField } from './deploy-to-field';
import { ProjectLifecycleField } from './project-lifecycle-field';
import { ProjectTagsField } from './project-tags-field';
import { useNavigate } from 'react-router-dom';
import { useSpaceUrl } from '@/shared/hooks/use-space-url.ts';

interface CreateProjectFormProps {
  className?: string;
}

export function CreateProjectForm({ className }: CreateProjectFormProps) {
  const navigate = useNavigate();
  const { getSpaceUrl } = useSpaceUrl();
  const createProjectMutation = useCreateProject();
  const uploadIconMutation = useUploadProjectIcon();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      emoji: '',
      iconFile: undefined,
      deployTo: 'aws',
      lifecycleStages: ['development'],
      tagIds: []
    }
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const slug = data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const project = await createProjectMutation.mutateAsync({
        name: data.name,
        slug: slug || 'project',
        description: data.description,
        ...(!data.iconFile && data.imageUrl?.trim() && { imageUrl: data.imageUrl.trim() }),
        ...(!data.iconFile && data.emoji?.trim() && { emoji: data.emoji.trim() }),
        status: 'active',
        lifecycleStages: data.lifecycleStages,
        tagIds: data.tagIds?.length ? data.tagIds : undefined
      });
      if (data.iconFile) {
        await uploadIconMutation.mutateAsync({
          projectId: project.id,
          file: data.iconFile
        });
      }
      toast.success('Project created successfully!');
      navigate(getSpaceUrl('/'));
    } catch (error) {
      toast.error('Failed to create project', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>
          Create a new project to deploy and manage your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <ProjectIconField form={form} />
              <ProjectNameField form={form} />
              <ProjectDescriptionField form={form} />
              <DeployToField form={form} />
              <ProjectLifecycleField form={form} />
              <ProjectTagsField form={form} />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || createProjectMutation.isPending || uploadIconMutation.isPending}
                >
                  {form.formState.isSubmitting || createProjectMutation.isPending || uploadIconMutation.isPending
                    ? 'Creating...'
                    : 'Create Project'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

