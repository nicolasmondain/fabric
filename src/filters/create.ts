import { filtersCreate } from '../@types/index';

export default [
  {
    length: 1,
    actions: ['curvefromfile'],
    preview: null,
    refresh: false,
    force: 'auto',
    medias: 'standard',
  },
  {
    length: 2,
    actions: ['curvefromfile', 'screen'],
    preview: 1,
    refresh: false,
    force: 'auto',
    medias: 'standard',
  },
  {
    length: 1,
    actions: ['multiply'],
    preview: null,
    refresh: false,
    force: 'auto',
    medias: 'session',
  },
  {
    length: 1,
    actions: ['lenticular'],
    preview: null,
    refresh: false,
    force: 'js',
    medias: 'standard',
  },
  {
    length: 1,
    actions: ['lenticular'],
    preview: null,
    refresh: false,
    force: 'js',
    medias: 'session',
  },
  {
    length: 1,
    actions: ['beauty'],
    preview: null,
    refresh: false,
    force: 'js',
    medias: 'standard',
  },
  {
    length: 2,
    actions: ['beauty', 'grayscale'],
    preview: null,
    refresh: false,
    force: 'js',
    medias: 'standard',
  },
  {
    length: 2,
    actions: ['beauty', 'curvefromfile'],
    preview: null,
    refresh: false,
    force: 'js',
    medias: 'standard',
  },
] as Array<filtersCreate>;
