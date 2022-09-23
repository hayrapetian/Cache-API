import { CACHE_LIMIT } from '@lib/constants';

export const isLimitReached = (postCount: number) => {
  return postCount >= CACHE_LIMIT;
};
