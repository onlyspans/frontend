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
  createSpaceSchema,
  type CreateSpaceFormData,
  useCreateSpace
} from '@/entities/space';
import { toast } from 'sonner';
import { SpaceNameField } from './space-name-field';
import { SpaceSlugField } from './space-slug-field';
import { SpaceDescriptionField } from './space-description-field';
import { useNavigate } from 'react-router-dom';
import { AvatarUploadField } from '@/shared/ui/avatar-upload-field.tsx';

interface CreateSpaceFormProps {
  className?: string;
}

export function CreateSpaceForm({ className }: CreateSpaceFormProps) {
  const navigate = useNavigate();
  const createSpaceMutation = useCreateSpace();

  const form = useForm<CreateSpaceFormData>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      avatar: '',
      avatarFile: undefined
    }
  });

  const onSubmit = async (data: CreateSpaceFormData) => {
    try {
      const newSpace = await createSpaceMutation.mutateAsync(data);
      toast.success('Space created successfully!');
      navigate(`/${newSpace.slug}`);
    } catch (error) {
      toast.error('Failed to create space', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Create New Space</CardTitle>
        <CardDescription>
          Create a new workspace to organize your projects and resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <AvatarUploadField
                form={form}
                title="Space Avatar"
                defaultInitials="SP"
              />
              <SpaceNameField form={form} />
              <SpaceSlugField form={form} />
              <SpaceDescriptionField form={form} />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || createSpaceMutation.isPending}
                >
                  {form.formState.isSubmitting || createSpaceMutation.isPending
                    ? 'Creating...'
                    : 'Create Space'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
