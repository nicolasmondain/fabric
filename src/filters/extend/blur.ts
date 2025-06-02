/* eslint-disable max-lines-per-function, array-element-newline, operator-linebreak */

import { homothetic, library } from '../../@types';

import globals from '../globals';

export const blur = (fabric: library) => {
  fabric.Image.filters.blur = fabric.util.createClass(fabric.Image.filters.Composed, {
    type: 'blur',
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    mainParameter: 'useBy',
    process: 'current',
    configuration: {},
    description: '',
    subFilters: [new fabric.Image.filters.Convolute({ matrix: [1, 1, 1, 1, 1, 1, 1, 1, 1] })],
  });

  fabric.Image.filters.blur.fromObject = fabric.Image.filters.Composed.fromObject;
};
