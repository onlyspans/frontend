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
  projectApi
} from '@/entities/project';
import { toast } from 'sonner';
import { ProjectNameField } from './project-name-field';
import { ProjectDescriptionField } from './project-description-field';
import { ProjectAvatarField } from './project-avatar-field';
import { DeployToField } from './deploy-to-field';
import { ProjectLifecycleField } from './project-lifecycle-field';
import { useNavigate } from 'react-router-dom';

interface CreateProjectFormProps {
  className?: string;
}

export function CreateProjectForm({ className }: CreateProjectFormProps) {
  const navigate = useNavigate();

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
      await projectApi.createProject(data);
      toast.success('Project created successfully!');
      navigate('/dashboard');
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
              <ProjectAvatarField form={form} />
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
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
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

