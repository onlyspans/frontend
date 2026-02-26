import { useState, useMemo } from 'react';
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

interface ProjectTagsFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

export function ProjectTagsField({ form }: ProjectTagsFieldProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [renameTag, setRenameTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [createName, setCreateName] = useState('');

  const { data: tagsData } = useTags({ pageSize: 100 });
  const allTags = tagsData?.items ?? [];
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();

  const tagIds = form.watch('tagIds') ?? [];
  const selectedTags = useMemo(() => {
    return allTags.filter((t) => tagIds.includes(t.id));
  }, [allTags, tagIds]);

  const availableToAdd = useMemo(() => {
    return allTags.filter((t) => !tagIds.includes(t.id));
  }, [allTags, tagIds]);

  const addTagId = (id: string) => {
    form.setValue('tagIds', [...tagIds, id]);
    setAddOpen(false);
  };

  const removeTagId = (id: string) => {
    form.setValue('tagIds', tagIds.filter((tid) => tid !== id));
  };

  const handleCreateTag = async () => {
    if (!createName.trim()) return;
    try {
      const tag = await createTagMutation.mutateAsync({
        name: createName.trim()
      });
      form.setValue('tagIds', [...tagIds, tag.id]);
      setCreateName('');
      setCreateOpen(false);
      setAddOpen(false);
    } catch {
      // error handled by mutation
    }
  };

  const handleRenameTag = async () => {
    if (!renameTag || !newTagName.trim()) return;
    try {
      await updateTagMutation.mutateAsync({
        id: renameTag.id,
        data: { name: newTagName.trim() }
      });
      setRenameTag(null);
      setNewTagName('');
    } catch {
      // error handled by mutation
    }
  };

  const openRename = (tag: Tag) => {
    setRenameTag(tag);
    setNewTagName(tag.name);
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
                    <DropdownMenu key={tag.id}>
                      <DropdownMenuTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer gap-1 pr-1"
                          style={
                            tag.color
                              ? {
                                backgroundColor: tag.color,
                                color: '#fff',
                                borderColor: 'transparent'
                              }
                              : undefined
                          }
                        >
                          {tag.name}
                          <XIcon
                            className="size-3 opacity-70"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeTagId(tag.id);
                            }}
                          />
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            openRename(tag);
                          }}
                        >
                          <PencilIcon className="size-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => removeTagId(tag.id)}
                          className="text-destructive"
                        >
                          <XIcon className="size-4 mr-2" />
                          Remove from project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                  <DropdownMenu open={addOpen} onOpenChange={setAddOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        <PlusIcon className="size-4 mr-1" />
                        Add tag
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
                      {availableToAdd.map((tag) => (
                        <DropdownMenuItem
                          key={tag.id}
                          onSelect={() => addTagId(tag.id)}
                        >
                          <span
                            className="size-2 rounded-full mr-2 shrink-0"
                            style={{
                              backgroundColor: tag.color ?? 'var(--muted)'
                            }}
                          />
                          {tag.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setAddOpen(false);
                          setCreateOpen(true);
                        }}
                        className="border-t mt-1"
                      >
                        <PlusIcon className="size-4 mr-2" />
                        Create new tag
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FormControl>
              <FieldDescription>
                Add, remove or rename tags. You can create new tags from here.
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="Tag name"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
            />
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
              disabled={!createName.trim() || createTagMutation.isPending}
            >
              {createTagMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!renameTag} onOpenChange={(open) => !open && setRenameTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name"
              onKeyDown={(e) => e.key === 'Enter' && handleRenameTag()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameTag(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRenameTag}
              disabled={!newTagName.trim() || updateTagMutation.isPending}
            >
              {updateTagMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
