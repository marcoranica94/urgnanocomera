import * as migration_20260306_100851 from './20260306_100851';

export const migrations = [
  {
    up: migration_20260306_100851.up,
    down: migration_20260306_100851.down,
    name: '20260306_100851'
  },
];
