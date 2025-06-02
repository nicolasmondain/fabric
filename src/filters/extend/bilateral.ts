/* eslint-disable max-lines-per-function */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

import cv from '../../../opencv/index.js';

export const bilateral = (fabric: library) => {
  fabric.Image.filters.bilateral = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'bilateral',
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    imageData2: null,
    value1: 0,
    value2: 0,
    mainParameter: 'useBy',
    process: 'current',
    configuration: { value1: 'Number', value2: 'Number' },
    description: '',
    applyTo2d(options: filtersApplyTo2dOptions) {
      // eslint-disable-line max-statements

      // @ts-ignore

      const source = cv.matFromImageData(
        this.process === 'current' ? options.imageData : options.originalImageData
      );

      // @ts-ignore

      const destination = new cv.Mat();

      // @ts-ignore

      cv.cvtColor(source, source, cv.COLOR_RGBA2RGB, 0);

      // @ts-ignore

      cv.bilateralFilter(
        source,
        destination,
        this.value1,
        this.value2,
        this.value2,
        cv.BORDER_DEFAULT
      );

      // @ts-ignore

      cv.cvtColor(destination, destination, cv.COLOR_RGB2RGBA, 0);

      // @ts-ignore

      const imageData2 = new ImageData(
        new Uint8ClampedArray(destination.data, destination.cols, destination.rows),
        options.sourceWidth,
        options.sourceHeight
      );

      source.delete();
      destination.delete();

      const { data } = this.process === 'current' ? options.imageData : options.originalImageData;
      const n = data.length;
      const data2 = imageData2.data;
      const m = data2.length;

      if (n === m) {
        for (let i = 0; i < n; i += 4) {
          if (
            methods.applytothecurrenti(
              i,
              this.homothetic.x,
              this.homothetic.y,
              this.homothetic.w,
              this.homothetic.h,
              options.sourceWidth
            )
          ) {
            data[i] = data2[i];
            data[i + 1] = data2[i + 1];
            data[i + 2] = data2[i + 2];
          }
        }
      }
    },
  });

  fabric.Image.filters.bilateral.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
