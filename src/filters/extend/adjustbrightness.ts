/* eslint-disable max-lines-per-function */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const adjustbrightness = (fabric: library) => {
  fabric.Image.filters.adjustbrightness = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'adjustbrightness',
    fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;
			uniform float uAdjustment;

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord);

				float adjustment = uAdjustment / 100.0 / 2.0;

				color.r = color.r + adjustment;
				color.g = color.g + adjustment;
				color.b = color.b + adjustment;

				gl_FragColor = color;

			}

		`,
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    value1: 0,
    configuration: { value1: 'Number' },
    description: '',
    mainParameter: 'useBy',
    process: 'current',
    applyTo2d(options: filtersApplyTo2dOptions) {
      if (this.value1 === 0) {
        return;
      }

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
          data[i] += this.value1;
          data[i + 1] += this.value1;
          data[i + 2] += this.value1;
        }
      }
    },
    getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram) {
      return {
        uHomothetic: gl.getUniformLocation(program, 'uHomothetic'),
        uAdjustment: gl.getUniformLocation(program, 'uAdjustment'),
      };
    },
    sendUniformData(
      gl: WebGLRenderingContext,
      uniformLocations: { [key: string]: WebGLUniformLocation }
    ) {
      gl.uniform1f(uniformLocations.uHomothetic, this.homothetic || globals.HOMOTHETIC_DEFAULT);
      gl.uniform1f(uniformLocations.uAdjustment, this.value1 || 0);
    },
  });

  fabric.Image.filters.adjustbrightness.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
