export const DEFAULT_COMMUNITY_LINK = 'https://chat.whatsapp.com/hsociety';

export const BOOTCAMP_GROUP_LINKS: Record<string, string> = {
  bc_1775270338500: 'https://chat.whatsapp.com/JpWNj3yy1TKGBoRjm6zksp',
};

export const getBootcampGroupLink = (bootcampId?: string | null): string | null => {
  if (!bootcampId) return null;
  return BOOTCAMP_GROUP_LINKS[String(bootcampId)] ?? null;
};

export const getConfiguredCommunityLink = (bootcampId?: string | null): string => {
  return getBootcampGroupLink(bootcampId) ?? DEFAULT_COMMUNITY_LINK;
};
