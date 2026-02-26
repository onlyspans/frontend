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
import { useTranslation } from '@/shared/lib/i18n';

interface CreateSpaceFormProps {
  className?: string;
}

export function CreateSpaceForm({ className }: CreateSpaceFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      toast.success(t('space.creation.success'));
      navigate(`/${newSpace.slug}`);
    } catch (error) {
      toast.error(t('space.creation.failed'), {
        description: error instanceof Error ? error.message : t('project.creation.unknownError')
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('space.creation.title')}</CardTitle>
        <CardDescription>
          {t('space.creation.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <AvatarUploadField
                form={form}
                title={t('space.creation.avatar')}
                defaultInitials={t('space.creation.defaultInitials')}
              />
              <SpaceNameField form={form} />
              <SpaceSlugField form={form} />
              <SpaceDescriptionField form={form} />

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || createSpaceMutation.isPending}
                >
                  {form.formState.isSubmitting || createSpaceMutation.isPending
                    ? t('space.creation.creating')
                    : t('space.creation.createSpace')}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
