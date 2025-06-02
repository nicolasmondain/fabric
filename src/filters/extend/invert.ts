/* eslint-disable max-lines-per-function */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const invert = (fabric: library) => {
  fabric.Image.filters.invert = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'invert',
    fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord) * 255.0;

				color.r = 255.0 - color.r;
				color.g = 255.0 - color.g;
				color.b = 255.0 - color.b;
				color.a = 255.0;

				gl_FragColor = color / 255.0;

			}

		`,
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    mainParameter: 'useBy',
    process: 'current',
    configuration: {},
    description: '',
    applyTo2d(options: filtersApplyTo2dOptions) {
      const { data } = this.process === 'current' ? options.imageData : options.originalImageData;
      const n = data.length;

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
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
          data[i + 3] = 255;
        }
      }
    },
    getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram) {
      return {
        uHomothetic: gl.getUniformLocation(program, 'uHomothetic'),
      };
    },
    sendUniformData(
      gl: WebGLRenderingContext,
      uniformLocations: { [key: string]: WebGLUniformLocation }
    ) {
      gl.uniform1f(uniformLocations.uHomothetic, this.homothetic || globals.HOMOTHETIC_DEFAULT);
    },
  });

  fabric.Image.filters.invert.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
