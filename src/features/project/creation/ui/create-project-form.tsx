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
  useCreateProject
} from '@/entities/project';
import { toast } from 'sonner';
import { ProjectNameField } from './project-name-field';
import { ProjectDescriptionField } from './project-description-field';
import { DeployToField } from './deploy-to-field';
import { ProjectLifecycleField } from './project-lifecycle-field';
import { useNavigate } from 'react-router-dom';
import { useSpaceUrl } from '@/shared/hooks/use-space-url.ts';
import { AvatarUploadField } from '@/shared/ui/avatar-upload-field.tsx';

interface CreateProjectFormProps {
  className?: string;
}

export function CreateProjectForm({ className }: CreateProjectFormProps) {
  const navigate = useNavigate();
  const { getSpaceUrl } = useSpaceUrl();
  const createProjectMutation = useCreateProject();

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      avatar: '',
      avatarFile: undefined,
      deployTo: 'aws',
      lifecycleId: ''
    }
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      const slug = data.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      await createProjectMutation.mutateAsync({
        name: data.name,
        slug: slug || 'project',
        description: data.description,
        status: 'active',
      });
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
              <AvatarUploadField
                form={form}
                title="Project Avatar"
                defaultInitials="PR"
              />
              <ProjectNameField form={form} />
              <ProjectDescriptionField form={form} />
              <DeployToField form={form} />
              <ProjectLifecycleField form={form} />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || createProjectMutation.isPending}
                >
                  {form.formState.isSubmitting || createProjectMutation.isPending
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

