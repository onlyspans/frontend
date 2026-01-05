import { useState, useEffect, useMemo } from 'react';
import { Field, FieldDescription, FieldTitle } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

interface AvatarFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  title: string;
  defaultInitials?: string;
  nameFieldName?: Path<T>;
  avatarFieldName?: Path<T>;
  avatarFileFieldName?: Path<T>;
}

const EMOJI_LIST = [
  '🚀', '💻', '⚡', '🔧', '🛠️', '📦',
  '✨', '💡', '🎯', '🌟', '🎨', '🔥',
  '🏗️', '📊', '📈', '🎪', '🏆', '💼',
  '🤝', '👋', '👩‍🔧', '👨‍💻', '💪', '🎉',
  '💬', '🌐', '🔗', '📱', '💾', '🎭',
  '🎬', '🎮', '🎲', '🔮', '⭐', '🎈'
];

interface EmojiGridProps {
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

function EmojiGrid({ onSelect, selectedEmoji }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className={cn(
            'flex items-center justify-center h-8 w-8 rounded-md text-xl',
            'hover:bg-accent transition-all',
            'focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1',
            selectedEmoji === emoji && 'bg-accent ring-1 ring-ring'
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

interface EmojiPickerProps {
  value?: string;
  onSelect: (emoji: string) => void;
  onClear?: () => void;
}

function EmojiPicker({ value, onSelect, onClear }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <span className="text-muted-foreground text-center w-full">
            {value ? value : 'Select'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="p-0"
        sideOffset={4}
      >
        <div className="p-2">
          <EmojiGrid onSelect={handleSelect} selectedEmoji={value} />
          {value && (
            <div className="border-t pt-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleClear}
              >
                Clear emoji
              </Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
  const [urlError, setUrlError] = useState<string | null>(null);

  const name = form.watch(nameFieldName) as string | undefined;
  const avatarValue = form.watch(avatarFieldName) as string | undefined;
  const avatarFileValue = form.watch(avatarFileFieldName) as File | undefined;

  const isEmoji = (str: string): boolean => {
    if (!str || str.trim() === '') return false;
    if (str.startsWith('http://') || str.startsWith('https://')) return false;
    const emojiRegex = /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Modifier}]$/u;
    return emojiRegex.test(str.trim());
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

  const avatarMode = useMemo<'url' | 'file' | 'emoji' | 'initials'>(() => {
    if (avatarFileValue) {
      return 'file';
    }
    if (avatarValue && isEmoji(avatarValue)) {
      return 'emoji';
    }
    if (avatarValue && isValidUrl(avatarValue)) {
      return 'url';
    }
    return 'initials';
  }, [avatarValue, avatarFileValue]);

  const previewUrl = useMemo<string | null>(() => {
    if (avatarMode === 'url' && avatarValue && isValidUrl(avatarValue)) {
      return avatarValue;
    }
    if (avatarMode === 'emoji' || avatarMode === 'initials') {
      return null;
    }
    return null;
  }, [avatarMode, avatarValue]);

  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageErrored, setImageErrored] = useState(false);

  useEffect(() => {
    if (avatarFileValue) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(avatarFileValue);
    } else {
      setFilePreview(null);
    }
  }, [avatarFileValue]);

  useEffect(() => {
    if (avatarMode === 'url' && previewUrl) {
      setImageLoaded(false);
      setImageErrored(false);
    } else {
      setImageLoaded(false);
      setImageErrored(false);
    }
  }, [avatarMode, previewUrl]);

  const avatarPreview = avatarMode === 'file' ? filePreview : previewUrl;
  
  const isImageLoading = useMemo(() => {
    return avatarMode === 'url' && previewUrl && !imageLoaded && !imageErrored;
  }, [avatarMode, previewUrl, imageLoaded, imageErrored]);

  const getInitials = (name: string | undefined) => {
    if (!name) return defaultInitials;
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
        form.setValue(avatarFileFieldName, undefined as any);
        form.setValue(avatarFieldName, '' as any);
      };
      reader.onloadend = () => {
        setUrlError(null);
      };
      reader.readAsDataURL(file);
      form.setValue(avatarFileFieldName, file as any);
      form.setValue(avatarFieldName, '' as any);
    } else {
      form.setValue(avatarFileFieldName, undefined as any);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    form.setValue(avatarFieldName, emoji as any);
    form.setValue(avatarFileFieldName, undefined as any);
    setUrlError(null);
  };

  const handleEmojiClear = () => {
    form.setValue(avatarFieldName, '' as any);
    form.setValue(avatarFileFieldName, undefined as any);
    setUrlError(null);
  };

  const handleAvatarUrlChange = (url: string) => {
    setUrlError(null);
    setImageLoaded(false);
    setImageErrored(false);

    if (!url.trim()) {
      form.setValue(avatarFieldName, '' as any);
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid image URL.');
      return;
    }

    form.setValue(avatarFieldName, url as any);
    form.setValue(avatarFileFieldName, undefined as any);
  };

  const handleImageError = () => {
    setImageErrored(true);
    setImageLoaded(false);
    setUrlError('Failed to load image from URL. Please check the link or use a different image.');
    toast.error('Invalid image URL', {
      description: 'The provided URL does not point to a valid image'
    });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageErrored(false);
    setUrlError(null);
  };

  return (
    <Field>
      <FieldTitle>{title}</FieldTitle>
      <div className="flex items-start gap-6">
        <Avatar className="size-20" key={`avatar-${avatarMode}-${avatarValue || 'empty'}`}>
          {avatarMode === 'emoji' && avatarValue ? (
            <AvatarFallback className="text-4xl bg-muted">
              {avatarValue}
            </AvatarFallback>
          ) : avatarMode === 'initials' ? (
            <AvatarFallback className="text-2xl">
              {getInitials(name)}
            </AvatarFallback>
          ) : avatarMode === 'file' || avatarMode === 'url' ? (
            <>
              {avatarPreview && (
                <AvatarImage
                  src={avatarPreview}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
              {isImageLoading && (
                <AvatarFallback className="text-2xl">
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </AvatarFallback>
              )}
              {!isImageLoading && !avatarPreview && (
                <AvatarFallback className="text-2xl">
                  {getInitials(name)}
                </AvatarFallback>
              )}
            </>
          ) : (
            <AvatarFallback className="text-2xl">
              {getInitials(name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="col-span-5 space-y-2">
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
            <div className="col-span-5 space-y-2">
              <Label>Enter Image URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/avatar.png"
                value={avatarMode === 'url' ? avatarValue || '' : ''}
                onChange={(e) => handleAvatarUrlChange(e.target.value)}
                className={urlError ? 'border-destructive' : ''}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Use Emoji</Label>
              <EmojiPicker
                value={avatarMode === 'emoji' ? avatarValue : undefined}
                onSelect={handleEmojiSelect}
                onClear={handleEmojiClear}
              />
            </div>
          </div>

          {urlError && (
            <p className="text-sm text-destructive">{urlError}</p>
          )}

          <FieldDescription className="text-xs">
            You can upload an image file (.jpg, .jpeg, .png, .webp {'<'} 5MB), provide a URL, or use an emoji.
          </FieldDescription>
        </div>
      </div>
    </Field>
  );
}
