import * as moment from 'moment';

export const isTTLExceeded = (updatedAt: number) => {
  return moment(updatedAt).isAfter(moment());
};
