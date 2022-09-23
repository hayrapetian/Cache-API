import { randomBytes } from 'crypto';

export const generateRandomString = (size: number = 10) => {
  return randomBytes(size).toString('hex');
};
