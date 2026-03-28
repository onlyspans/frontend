import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '../api/event-api';
import type { SettingsDTO } from '../model/types';
import { eventQueryKeys } from './query-keys';

export function useUpdateEventsSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SettingsDTO) => eventApi.updateSettings(body),
    onSuccess: (data) => {
      queryClient.setQueryData(eventQueryKeys.settings(), data);
    }
  });
}
