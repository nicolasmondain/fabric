/* eslint-disable max-lines-per-function */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const desaturate = (fabric: library) => {
  fabric.Image.filters.desaturate = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'desaturate',
    fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord) * 255.0;

				float average = (color.r + color.g + color.b) / 3.0;

				color.r = color.r + max(0.0, floor(average - color.r + 0.0));
				color.g = color.g + max(0.0, floor(average - color.g + 0.0));
				color.b = color.b + max(0.0, floor(average - color.b + 0.0));

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
          const average = (data[i] + data[i + 1] + data[i + 2]) / 3;

          data[i] += Math.max(0, Math.round(average - data[i]));
          data[i + 1] += Math.max(0, Math.round(average - data[i + 1]));
          data[i + 2] += Math.max(0, Math.round(average - data[i + 2]));
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

  fabric.Image.filters.desaturate.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
