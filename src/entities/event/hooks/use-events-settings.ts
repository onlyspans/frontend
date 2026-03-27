import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api/event-api';
import { eventQueryKeys } from './query-keys';

export function useEventsSettings() {
  return useQuery({
    queryKey: eventQueryKeys.settings(),
    queryFn: () => eventApi.getSettings()
  });
}
