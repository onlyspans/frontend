'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Field } from '@/shared/ui/field';
import { createSpaceSchema, type CreateSpaceFormData } from '@/entities/space/model/create-space-schema';

interface CreateSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSpaceFormData) => void;
}

export function CreateSpaceDialog({
  open,
  onOpenChange,
  onSubmit
}: CreateSpaceDialogProps) {
  const form = useForm<CreateSpaceFormData>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: '',
      slug: ''
    }
  });

  const handleSubmit = async (data: CreateSpaceFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your projects and resources
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FormLabel>Space Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="My Workspace"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <Field>
                    <FormLabel>Space Slug</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="my-workspace"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9-_]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </Field>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create Space'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
