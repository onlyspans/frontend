import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../api/project-api';
import type { CreateProjectFormData } from '@/entities/project';
import type { Project } from '../model/project';
import { projectQueryKeys } from './query-keys';
import { useCurrentSpace } from '@/entities/space';

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { space } = useCurrentSpace();

  return useMutation({
    mutationFn: (data: CreateProjectFormData) => {
      if (!space?.id) {
        throw new Error('Space ID is required');
      }
      return projectApi.createProject(data, space.id);
    },
    onMutate: async (newProjectData) => {
      if (!space?.id) return { previousProjects: undefined };

      await queryClient.cancelQueries({ queryKey: projectQueryKeys.all(space.id) });

      const previousProjects = queryClient.getQueryData<Project[]>(
        projectQueryKeys.all(space.id)
      );

      queryClient.setQueryData<Project[]>(projectQueryKeys.all(space.id), (old = []) => {
        const optimisticProject: Project = {
          id: `temp-${Date.now()}`,
          spaceId: space.id,
          name: newProjectData.name,
          description: newProjectData.description,
          avatar: newProjectData.avatar || undefined,
          deployTo: newProjectData.deployTo,
          lifecycleId: newProjectData.lifecycleId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return [...old, optimisticProject];
      });

      return { previousProjects };
    },
    onError: (_err, _newProjectData, context) => {
      if (context?.previousProjects && space?.id) {
        queryClient.setQueryData(projectQueryKeys.all(space.id), context.previousProjects);
      }
    },
    onSuccess: (newProject) => {
      if (space?.id) {
        queryClient.setQueryData<Project[]>(projectQueryKeys.all(space.id), (old = []) => {
          const withoutTemp = old.filter((p) => !p.id.startsWith('temp-'));
          return [...withoutTemp, newProject];
        });
      }
    }
  });
}
