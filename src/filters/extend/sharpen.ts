/* eslint-disable max-lines-per-function, array-element-newline, operator-linebreak */

import { homothetic, library } from '../../@types';

import globals from '../globals';

export const sharpen = (fabric: library) => {
  fabric.Image.filters.sharpen = fabric.util.createClass(fabric.Image.filters.Composed, {
    type: 'sharpen',
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    mainParameter: 'useBy',
    process: 'current',
    configuration: {},
    description: '',
    subFilters: [new fabric.Image.filters.Convolute({ matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0] })],
  });

  fabric.Image.filters.sharpen.fromObject = fabric.Image.filters.Composed.fromObject;
};
