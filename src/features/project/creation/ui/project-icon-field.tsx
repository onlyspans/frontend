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
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import type { CreateProjectFormData } from '@/entities/project';

const EMOJI_LIST = [
  '🚀', '💻', '⚡', '🔧', '🛠️', '📦',
  '✨', '💡', '🎯', '🌟', '🎨', '🔥',
  '🏗️', '📊', '📈', '🎪', '🏆', '💼',
  '🤝', '👋', '👩‍🔧', '👨‍💻', '💪', '🎉',
  '💬', '🌐', '🔗', '📱', '💾', '🎭',
  '🎬', '🎮', '🎲', '🔮', '⭐', '🎈'
];

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function isEmoji(str: string): boolean {
  if (!str?.trim()) return false;
  if (str.startsWith('http://') || str.startsWith('https://')) return false;
  const emojiRegex = /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Modifier}]$/u;
  return emojiRegex.test(str.trim());
}

function isValidImageUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const ext = url.pathname.toLowerCase().split('.').pop();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext ?? '');
  } catch {
    return false;
  }
}

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
            'flex h-8 w-8 items-center justify-center rounded-md text-xl transition-all',
            'hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1',
            selectedEmoji === emoji && 'bg-accent ring-1 ring-ring'
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

interface ProjectIconFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectIconField({ form }: ProjectIconFieldProps) {
  const [urlError, setUrlError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageErrored, setImageErrored] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const name = form.watch('name') ?? '';
  const imageUrl = form.watch('imageUrl') ?? '';
  const emoji = form.watch('emoji') ?? '';
  const iconFile = form.watch('iconFile');

  const mode = useMemo<'file' | 'url' | 'emoji' | 'initials'>(() => {
    if (iconFile) return 'file';
    if (emoji?.trim() && isEmoji(emoji)) return 'emoji';
    if (imageUrl?.trim() && isValidImageUrl(imageUrl)) return 'url';
    return 'initials';
  }, [iconFile, imageUrl, emoji]);

  const previewUrl = useMemo(() => {
    if (mode === 'url' && imageUrl?.trim()) return imageUrl.trim();
    if (mode === 'file' && filePreview) return filePreview;
    return null;
  }, [mode, imageUrl, filePreview]);

  useEffect(() => {
    if (iconFile) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(iconFile);
    } else {
      setFilePreview(null);
    }
  }, [iconFile]);

  useEffect(() => {
    if (mode === 'url' && previewUrl) {
      setImageLoaded(false);
      setImageErrored(false);
    }
  }, [mode, previewUrl]);

  const isImageLoading = mode === 'url' && previewUrl && !imageLoaded && !imageErrored;

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Allowed: PNG, JPEG, GIF, WebP'
        });
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File too large', {
          description: 'Maximum size is 2 MB'
        });
        return;
      }
      form.setValue('iconFile', file);
      form.setValue('imageUrl', '');
      form.setValue('emoji', '');
      setUrlError(null);
    } else {
      form.setValue('iconFile', undefined);
    }
  };

  const handleEmojiSelect = (value: string) => {
    form.setValue('emoji', value);
    form.setValue('iconFile', undefined);
    form.setValue('imageUrl', '');
    setUrlError(null);
    setEmojiOpen(false);
  };

  const handleEmojiClear = () => {
    form.setValue('emoji', '');
    setEmojiOpen(false);
  };

  const handleUrlChange = (value: string) => {
    setUrlError(null);
    setImageLoaded(false);
    setImageErrored(false);
    if (!value.trim()) {
      form.setValue('imageUrl', '');
      return;
    }
    if (!isValidImageUrl(value)) {
      setUrlError('Enter a valid image URL (PNG, JPEG, GIF, WebP).');
      return;
    }
    form.setValue('imageUrl', value.trim());
    form.setValue('iconFile', undefined);
    form.setValue('emoji', '');
  };

  const handleImageError = () => {
    setImageErrored(true);
    setImageLoaded(false);
    setUrlError('Failed to load image. Check the URL or use a file/emoji.');
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageErrored(false);
    setUrlError(null);
  };

  const initials = getInitials(name || 'Project');

  return (
    <Field>
      <FieldTitle>Project icon</FieldTitle>
      <div className="flex items-start gap-6">
        <Avatar
          className="size-20 shrink-0"
          key={`${mode}-${previewUrl ?? 'none'}-${emoji || 'e'}`}
        >
          {mode === 'emoji' && emoji ? (
            <AvatarFallback className="bg-muted text-4xl">
              {emoji}
            </AvatarFallback>
          ) : mode === 'initials' ? (
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          ) : (mode === 'file' || mode === 'url') && previewUrl ? (
            <>
              <AvatarImage
                src={previewUrl}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {isImageLoading && (
                <AvatarFallback className="text-2xl">
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </AvatarFallback>
              )}
              {imageErrored && (
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              )}
            </>
          ) : (
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="min-w-0 flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-12">
            <div className="space-y-2 sm:col-span-4">
              <Label>Upload file</Label>
              <Input
                key={iconFile ? 'has-file' : 'no-file'}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
            </div>
            <div className="space-y-2 sm:col-span-4">
              <Label>Image URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/logo.png"
                value={mode === 'url' ? imageUrl : ''}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={urlError ? 'border-destructive' : ''}
              />
            </div>
            <div className="space-y-2 sm:col-span-4">
              <Label>Emoji</Label>
              <DropdownMenu open={emojiOpen} onOpenChange={setEmojiOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    <span className={emoji ? '' : 'text-muted-foreground'}>
                      {emoji || 'Select'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="p-0" sideOffset={4}>
                  <div className="p-2">
                    <EmojiGrid
                      onSelect={handleEmojiSelect}
                      selectedEmoji={mode === 'emoji' ? emoji : undefined}
                    />
                    {emoji && (
                      <div className="mt-2 border-t pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={handleEmojiClear}
                        >
                          Clear emoji
                        </Button>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {urlError && (
            <p className="text-sm text-destructive">{urlError}</p>
          )}
          <FieldDescription className="text-xs">
            Upload an image (PNG, JPEG, GIF, WebP, max 2 MB), enter a URL, or pick an emoji.
          </FieldDescription>
        </div>
      </div>
    </Field>
  );
}
