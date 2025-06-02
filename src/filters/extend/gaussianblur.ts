/* eslint-disable max-lines-per-function */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

import cv from '../../../opencv/index.js';

export const gaussianblur = (fabric: library) => {
  fabric.Image.filters.gaussianblur = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'gaussianblur',
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    imageData2: null,
    value1: 0,
    mainParameter: 'useBy',
    process: 'current',
    configuration: { value1: 'Number' },
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

      const size = new cv.Size();

      // @ts-ignore

      cv.GaussianBlur(source, destination, size, this.value1, this.value1, cv.BORDER_DEFAULT);

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

  fabric.Image.filters.gaussianblur.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
