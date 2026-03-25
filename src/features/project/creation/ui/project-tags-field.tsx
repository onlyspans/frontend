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
import { useTranslation } from '@/shared/lib/i18n';
import { getContrastTextColor } from '@/shared/lib/color/get-contrast-text-color';
import { getHexColorErrorKey } from '@/shared/lib/color/hex';

interface ProjectTagsFieldProps {
  form: UseFormReturn<CreateProjectFormData>;
}

const DEFAULT_COLOR = '#6366f1';

export function ProjectTagsField({ form }: ProjectTagsFieldProps) {
  const { t } = useTranslation();
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

  const createColorErrorKey = getHexColorErrorKey(createColor);
  const editColorErrorKey = getHexColorErrorKey(editColor);
  const createColorError = createColorErrorKey ? t(createColorErrorKey) : null;
  const editColorError = editColorErrorKey ? t(editColorErrorKey) : null;

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
    if (!createName.trim() || createColorErrorKey) return;
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
    if (!editTag || !editName.trim() || editColorErrorKey) return;
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
              <FormLabel>{t('project.tags')}</FormLabel>
              <FormControl>
                <div className="flex flex-wrap items-center gap-2 min-h-10">
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
                        type="button"
                        variant='ghost'
                        size='icon-sm'
                        className='size-4'
                        aria-label={t('project.creation.removeTag')}
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
                      <Button type="button" variant='secondary' size="sm">
                        <PlusIcon className="size-4 mr-1" />
                        {t('project.creation.addTag')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
                      {allTags.map((tag) => (
                        <DropdownMenuItem
                          key={tag.id}
                          onSelect={(e) => {
                            e.preventDefault();
                            if (!tagIds.includes(tag.id)) addTagId(tag.id);
                          }}
                          className="group flex cursor-pointer items-center gap-2"
                        >
                          <span
                            className="size-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor: tag.color ?? 'var(--muted)'
                            }}
                          />
                          <span className="min-w-0 flex-1 truncate">{tag.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-6 shrink-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openEdit(tag);
                            }}
                            aria-label={t('project.creation.editTagAria')}
                          >
                            <PencilIcon className="size-4" />
                          </Button>
                        </DropdownMenuItem>
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
                        {t('project.creation.createNewTag')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FormControl>
              <FieldDescription>
                {t('project.creation.tagsFieldDescription')}
              </FieldDescription>
              <FormMessage />
            </Field>
          </FormItem>
        )}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project.creation.createTag')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('project.creation.tagName')}</label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder={t('project.creation.tagNamePlaceholder')}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('project.creation.tagDescriptionOptional')}</label>
              <Textarea
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                placeholder={t('project.creation.tagDescriptionPlaceholder')}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('project.creation.colorOptional')}</label>
              <div className="flex flex-col gap-2">
                <div className="min-h-[120px] w-full">
                  <HexColorPicker
                    color={createColor}
                    onChange={setCreateColor}
                    style={{ width: '100%', height: 120 }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={createColor}
                    onChange={(e) => setCreateColor(e.target.value)}
                    placeholder={t('project.creation.colorPlaceholder')}
                    className="font-mono w-24"
                    aria-invalid={!!createColorError}
                    aria-describedby={createColorError ? 'create-color-error' : undefined}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateColor('')}
                  >
                    {t('project.creation.clearColor')}
                  </Button>
                </div>
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
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleCreateTag}
              disabled={!createName.trim() || !!createColorErrorKey || createTagMutation.isPending}
            >
              {createTagMutation.isPending ? t('project.creation.creatingTag') : t('project.creation.createTagButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTag} onOpenChange={(open) => !open && setEditTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('project.creation.editTag')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('project.creation.tagName')}</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={t('project.creation.tagNamePlaceholder')}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEditTag()}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('project.creation.tagDescriptionOptional')}</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder={t('project.creation.tagDescriptionPlaceholder')}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('project.creation.colorOptional')}</label>
              <div className="flex flex-col gap-2">
                <div className="min-h-[120px] w-full">
                  <HexColorPicker
                    color={editColor}
                    onChange={setEditColor}
                    style={{ width: '100%', height: 120 }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    placeholder={t('project.creation.colorPlaceholder')}
                    className="font-mono w-24"
                    aria-invalid={!!editColorError}
                    aria-describedby={editColorError ? 'edit-color-error' : undefined}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditColor('')}
                  >
                    {t('project.creation.clearColor')}
                  </Button>
                </div>
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
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleSaveEditTag}
              disabled={!editName.trim() || !!editColorErrorKey || updateTagMutation.isPending}
            >
              {updateTagMutation.isPending ? t('common.saving') : t('project.creation.saveButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
