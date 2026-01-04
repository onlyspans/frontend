import { useParams } from 'react-router-dom';

export function useSpaceUrl() {
  const params = useParams();
  const spaceSlug = params.spaceSlug || 'default';

  const getSpaceUrl = (url: string) => {
    if (!url) return `/${spaceSlug}`;

    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    if (cleanUrl.startsWith(`${spaceSlug}/`)) {
      return `/${cleanUrl}`;
    }
    return `/${spaceSlug}/${cleanUrl}`;
  };

  return {
    spaceSlug,
    getSpaceUrl
  };
}
