import { useState } from 'react';
import { Field, FieldDescription, FieldTitle } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { toast } from 'sonner';

interface AvatarFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  title: string;
  defaultInitials?: string;
  nameFieldName?: Path<T>;
  avatarFieldName?: Path<T>;
  avatarFileFieldName?: Path<T>;
}

export function AvatarUploadField<T extends FieldValues>(
  {
    form,
    title,
    defaultInitials = 'AV',
    nameFieldName = 'name' as Path<T>,
    avatarFieldName = 'avatar' as Path<T>,
    avatarFileFieldName = 'avatarFile' as Path<T>
  }: AvatarFieldProps<T>
) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarMode, setAvatarMode] = useState<'url' | 'file' | 'initials'>(
    'initials'
  );
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const name = form.watch(nameFieldName) as string | undefined;

  const getInitials = (name: string | undefined) => {
    if (!name) return defaultInitials;
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
      form.setValue(avatarFileFieldName, file as any);
      form.setValue(avatarFieldName, '' as any);
      setAvatarMode('file');
    } else {
      setAvatarPreview(null);
      form.setValue(avatarFileFieldName, undefined as any);
      setAvatarMode('initials');
    }
  };

  const handleAvatarUrlChange = (url: string) => {
    setUrlError(null);

    if (!url.trim()) {
      form.setValue(avatarFieldName, '' as any);
      setAvatarPreview(null);
      setAvatarMode('initials');
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid image URL.');
      form.setValue(avatarFieldName, '' as any);
      setAvatarPreview(null);
      setAvatarMode('initials');
      return;
    }

    form.setValue(avatarFieldName, url as any);
    form.setValue(avatarFileFieldName, undefined as any);
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
    form.setValue(avatarFieldName, '' as any);
    toast.error('Invalid image URL', {
      description: 'The provided URL does not point to a valid image'
    });
  };

  // Handle successful image load
  const handleImageLoad = () => {
    setIsImageLoading(false);
    setUrlError(null);
  };

  const avatarValue = form.watch(avatarFieldName) as string | undefined;

  return (
    <Field>
      <FieldTitle>{title}</FieldTitle>
      <div className="flex items-start gap-6">
        <Avatar className="size-20">
          {avatarMode === 'initials' ? (
            <AvatarFallback className="text-2xl">
              {getInitials(name)}
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
                  {getInitials(name)}
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
              value={avatarValue || ''}
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
