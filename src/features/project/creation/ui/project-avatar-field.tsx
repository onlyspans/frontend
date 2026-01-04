import { useState } from 'react';
import { Field, FieldDescription, FieldTitle } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import type { CreateProjectFormData } from '@/entities/project';

interface ProjectAvatarFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectAvatarField({ form }: ProjectAvatarFieldProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarMode, setAvatarMode] = useState<'url' | 'file' | 'initials'>(
    'initials'
  );
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const projectName = form.watch('name');

  const getInitials = (name: string) => {
    if (!name) return 'PR';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);

      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
      }

      const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      const pathname = url.pathname.toLowerCase();
      const extension = pathname.split('.').pop();
      return !(!extension || !imageExtensions.includes(extension));
    } catch {
      return false;
    }
  };

  const handleAvatarFileChange = (file: File | undefined) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Please select a JPG, PNG, or WebP image'
        });
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setAvatarPreview(null);
        setAvatarMode('initials');
      };
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setUrlError(null);
      };
      reader.readAsDataURL(file);
      form.setValue('avatarFile', file);
      form.setValue('avatar', '');
      setAvatarMode('file');
    } else {
      setAvatarPreview(null);
      form.setValue('avatarFile', undefined);
      setAvatarMode('initials');
    }
  };

  const handleAvatarUrlChange = (url: string) => {
    setUrlError(null);

    if (!url.trim()) {
      form.setValue('avatar', '');
      setAvatarPreview(null);
      setAvatarMode('initials');
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid image URL.');
      form.setValue('avatar', '');
      setAvatarPreview(null);
      setAvatarMode('initials');
      return;
    }

    form.setValue('avatar', url);
    form.setValue('avatarFile', undefined);
    setAvatarPreview(url);
    setAvatarMode('url');
    setIsImageLoading(true);
  };

  // Handle image load error
  const handleImageError = () => {
    setIsImageLoading(false);
    setUrlError('Failed to load image from URL. Please check the link or use a different image.');
    setAvatarPreview(null);
    setAvatarMode('initials');
    form.setValue('avatar', '');
    toast.error('Invalid image URL', {
      description: 'The provided URL does not point to a valid image'
    });
  };

  // Handle successful image load
  const handleImageLoad = () => {
    setIsImageLoading(false);
    setUrlError(null);
  };

  return (
    <Field>
      <FieldTitle>Project Avatar</FieldTitle>
      <div className="flex items-start gap-6">
        <Avatar className="size-20">
          {avatarMode === 'initials' ? (
            <AvatarFallback className="text-2xl">
              {getInitials(projectName || '')}
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage
                src={avatarPreview || undefined}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {isImageLoading && (
                <AvatarFallback className="text-2xl">
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </AvatarFallback>
              )}
              {!isImageLoading && avatarMode === 'url' && !avatarPreview && (
                <AvatarFallback className="text-2xl">
                  {getInitials(projectName || '')}
                </AvatarFallback>
              )}
            </>
          )}
        </Avatar>
        <div className="grid grid-cols-1 lg:grid-cols-2 space-y-2 w-full">
          <div className="col-span-1 space-y-2 w-full lg:pr-2">
            <Label>Upload Image</Label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleAvatarFileChange(file);
              }}
            />
          </div>
          <div className="col-span-1 space-y-2 w-full lg:pl-2">
            <Label>Enter Image URL</Label>
            <Input
              type="url"
              placeholder="https://example.com/avatar.png"
              value={form.watch('avatar') || ''}
              onChange={(e) => handleAvatarUrlChange(e.target.value)}
              className={urlError ? 'border-destructive' : ''}
            />
            {urlError && (
              <p className="text-sm text-destructive">{urlError}</p>
            )}
          </div>
          <FieldDescription className="col-span-2">
            You can upload an image file or provide a URL. (.jpg, .jpeg, .png, .webp)
          </FieldDescription>
        </div>
      </div>
    </Field>
  );
}
