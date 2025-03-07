import { flag } from 'flags/next';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    decide() {
      return this.defaultValue as boolean;
    },
  });
