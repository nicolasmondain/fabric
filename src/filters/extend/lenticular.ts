/* eslint-disable max-lines-per-function, array-element-newline, max-depth, no-confusing-arrow, max-statements, complexity */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const lenticular = (fabric: library) => {
  fabric.Image.filters.lenticular = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'lenticular',
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    imageData2: null,
    incrustation: {} as { a: number; x: number; y: number; w: number; h: number },
    configuration: { imageData2: 'HTMLImageElement', incrustation: 'Object' },
    description: '',
    mainParameter: 'useBy',
    canvas: null,
    process: 'current',
    applyTo2d(options: filtersApplyTo2dOptions) {
      const STRIPES = options.sourceWidth > options.sourceHeight ? 'portrait' : 'landscape';
      const BAND_RULES = [
        { w: 1800, h: 1200, dpi: 300, lpi: 50, px: 3 },
        { w: 1920, h: 1280, dpi: 320, lpi: 40, px: 4 },
        { w: 3600, h: 2400, dpi: 600, lpi: 60, px: 5 },
      ];

      const rule = BAND_RULES.find(
        (r) =>
          (r.w === options.sourceWidth && r.h === options.sourceHeight) ||
          (r.w === options.sourceHeight && r.h === options.sourceWidth)
      );
      const steps = [] as Array<number>;

      if (!rule) {
        return;
      }

      const lines = STRIPES === 'portrait' ? options.sourceWidth : options.sourceHeight;

      for (let i = 0; i < lines; i += 1) {
        if (i % rule.px === 0 && i !== 0) {
          steps.push(i);
        }
      }

      const { data } = this.process === 'current' ? options.imageData : options.originalImageData;
      const n = data.length;
      const data2 = this.imageData2.data;
      const m = data2.length;
      const images = [data, data2];
      const alternate = (index: number) => (index ? 0 : 1);

      if (n === m) {
        let ii = 0;
        let py = -1;

        for (let i = 0; i < n; i += 4) {
          const { x, y } = methods.getxy(i, options.sourceWidth);

          if (STRIPES === 'portrait' && steps.includes(x)) {
            if (py !== y) {
              py = y;
              ii = 0;
            }

            ii = alternate(ii);
          } else if (STRIPES === 'landscape' && steps.includes(y) && py !== y) {
            py = y;
            ii = alternate(ii);
          }

          if (
            x >= this.incrustation.x &&
            x <= this.incrustation.x + this.incrustation.w &&
            y >= this.incrustation.y &&
            y <= this.incrustation.y + this.incrustation.h
          ) {
            data[i] = images[ii][i];
            data[i + 1] = images[ii][i + 1];
            data[i + 2] = images[ii][i + 2];
          }
        }
      }
    },
  });

  fabric.Image.filters.lenticular.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
