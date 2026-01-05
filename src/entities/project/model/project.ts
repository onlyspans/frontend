export interface Project {
  id: string;
  spaceId: string;
  name: string;
  description: string;
  avatar?: string;
  deployTo: 'aws' | 'yandex-cloud' | 'kubernetes';
  lifecycleId: string;
  createdAt: string;
  updatedAt: string;
}
