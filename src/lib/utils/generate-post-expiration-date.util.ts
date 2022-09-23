import * as moment from 'moment';
import { KEY_TTL } from '@lib/constants';

export const generatePostExpirationDate = () => {
  return moment().valueOf() + KEY_TTL;
};
