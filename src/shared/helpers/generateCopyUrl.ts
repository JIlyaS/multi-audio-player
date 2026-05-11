export const generateCopyUrl = (id: string, type: 'track' | 'playlist'): string => {
 return `${window.location.protocol}//${window.location.host}/${window.location.pathname}${type}s?${type}Id=${id}`;
}

