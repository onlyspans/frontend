import { useState, useMemo } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/ui/form';
import { Field, FieldDescription } from '@/shared/ui/field';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/shared/ui/dialog';
import { useTags, useCreateTag, useUpdateTag } from '@/entities/tag';
import type { Tag } from '@/entities/tag';
import type { UseFormReturn } from 'react-hook-form';
import type { CreateProjectFormData } from '@/entities/project';
import { PlusIcon, PencilIcon, XIcon } from 'lucide-react';
import { Separator } from '@/shared/ui/separator';

interface ProjectTagsFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

const DEFAULT_COLOR = '#6366f1';

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/** Returns dark (#000) or light (#fff) text color for contrast on the given hex background. */
function getContrastTextColor(hex: string | null): string {
  if (!hex || !HEX_COLOR_REGEX.test(hex)) return '#fff';
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? '#000' : '#fff';
}

function getColorError(value: string): string | null {
  if (!value.trim()) return null;
  if (!value.startsWith('#')) return 'Color must start with #';
  if (value.length !== 7) return 'Color must be 7 characters (#RRGGBB)';
  if (!HEX_COLOR_REGEX.test(value)) return 'Use only hex digits (0-9, A-F) after #';
  return null;
}

export function ProjectTagsField({ form }: ProjectTagsFieldProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createColor, setCreateColor] = useState(DEFAULT_COLOR);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editColor, setEditColor] = useState(DEFAULT_COLOR);

  const { data: tagsData } = useTags({ pageSize: 100 });
  const allTags = tagsData?.items ?? [];
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();

  const createColorError = getColorError(createColor);
  const editColorError = getColorError(editColor);

  const tagIds = form.watch('tagIds') ?? [];
  const selectedTags = useMemo(() => {
    return allTags.filter((t) => tagIds.includes(t.id));
  }, [allTags, tagIds]);

  const addTagId = (id: string) => {
    form.setValue('tagIds', [...tagIds, id]);
    setAddOpen(false);
  };

  const removeTagId = (id: string) => {
    form.setValue('tagIds', tagIds.filter((tid) => tid !== id));
  };

  const handleCreateTag = async () => {
    if (!createName.trim() || createColorError) return;
    try {
      const tag = await createTagMutation.mutateAsync({
        name: createName.trim(),
        description: createDescription.trim() || undefined,
        color: createColor.trim() || undefined
      });
      form.setValue('tagIds', [...tagIds, tag.id]);
      setCreateName('');
      setCreateDescription('');
      setCreateColor(DEFAULT_COLOR);
      setCreateOpen(false);
      setAddOpen(false);
    } catch {
      // error handled by mutation
    }
  };

  const handleSaveEditTag = async () => {
    if (!editTag || !editName.trim() || editColorError) return;
    try {
      await updateTagMutation.mutateAsync({
        id: editTag.id,
        data: {
          name: editName.trim(),
          description: editDescription.trim() || undefined,
          color: editColor.trim() || undefined
        }
      });
      setEditTag(null);
    } catch {
      // error handled by mutation
    }
  };

  const openEdit = (tag: Tag) => {
    setEditTag(tag);
    setEditName(tag.name);
    setEditDescription(tag.description ?? '');
    setEditColor(tag.color ?? DEFAULT_COLOR);
    setAddOpen(false);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="tagIds"
        render={() => (
          <FormItem>
            <Field>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="flex flex-wrap items-center gap-2 rounded-md border p-2 min-h-10">
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="flex cursor-pointer items-center gap-1 pr-1"
                      style={
                        tag.color
                          ? {
                              backgroundColor: tag.color,
                              color: getContrastTextColor(tag.color),
                              borderColor: 'transparent'
                            }
                          : undefined
                      }
                    >
                      <span
                        role="button"
                        tabIndex={0}
                        className="min-w-0 flex-1 cursor-pointer truncate"
                        onClick={() => openEdit(tag)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openEdit(tag);
                          }
                        }}
                      >
                        {tag.name}
                      </span>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        className='size-4'
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeTagId(tag.id);
                        }}
                      >
                        <XIcon className="size-3" />
                      </Button>
                    </Badge>
                  ))}
                  <DropdownMenu open={addOpen} onOpenChange={setAddOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <PlusIcon className="size-4 mr-1" />
                        Add tag
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
                      {allTags.map((tag) => (
                        <div
                          key={tag.id}
                          className="group flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent"
                        >
                          <button
                            type="button"
                            className="flex flex-1 items-center gap-2 text-left"
                            onClick={() => {
                              if (!tagIds.includes(tag.id)) addTagId(tag.id);
                            }}
                          >
                            <span
                              className="size-2 shrink-0 rounded-full"
                              style={{
                                backgroundColor: tag.color ?? 'var(--muted)'
                              }}
                            />
                            {tag.name}
                          </button>
                          <button
                            type="button"
                            className="rounded p-1 opacity-0 hover:bg-accent-foreground/10 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(tag);
                            }}
                            aria-label="Edit tag"
                          >
                            <PencilIcon className="size-4" />
                          </button>
                        </div>
                      ))}
                      <Separator/>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setAddOpen(false);
                          setCreateOpen(true);
                        }}
                      >
                        <PlusIcon className="size-4 mr-2" />
                        Create new tag
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FormControl>
              <FieldDescription>
                Add or remove tags from the project. Create and edit tags via the list.
              </FieldDescription>
              <FormMessage />
            </Field>
          </FormItem>
        )}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Tag name"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder="Tag description"
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color (optional)</label>
              <div className="flex flex-col gap-2">
                <div className="min-h-[120px] w-full">
                  <HexColorPicker
                    color={createColor}
                    onChange={setCreateColor}
                    style={{ width: '100%', height: 120 }}
                  />
                </div>
                <Input
                  value={createColor}
                  onChange={(e) => setCreateColor(e.target.value)}
                  placeholder="#000000"
                  className="font-mono w-24"
                  aria-invalid={!!createColorError}
                  aria-describedby={createColorError ? 'create-color-error' : undefined}
                />
                {createColorError && (
                  <p id="create-color-error" className="text-sm text-destructive">
                    {createColorError}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateTag}
              disabled={!createName.trim() || !!createColorError || createTagMutation.isPending}
            >
              {createTagMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTag} onOpenChange={(open) => !open && setEditTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Tag name"
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEditTag()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Tag description"
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color (optional)</label>
              <div className="flex flex-col gap-2">
                <div className="min-h-[120px] w-full">
                  <HexColorPicker
                    color={editColor}
                    onChange={setEditColor}
                    style={{ width: '100%', height: 120 }}
                  />
                </div>
                <Input
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  placeholder="#000000"
                  className="font-mono w-24"
                  aria-invalid={!!editColorError}
                  aria-describedby={editColorError ? 'edit-color-error' : undefined}
                />
                {editColorError && (
                  <p id="edit-color-error" className="text-sm text-destructive">
                    {editColorError}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditTag(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveEditTag}
              disabled={!editName.trim() || !!editColorError || updateTagMutation.isPending}
            >
              {updateTagMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
