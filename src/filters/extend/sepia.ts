/* eslint-disable max-lines-per-function */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const sepia = (fabric: library) => {
  fabric.Image.filters.sepia = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'sepia',
    fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord) * 255.0;

				float r = (color.b * 0.189) + (color.g * 0.769) + (color.r * 0.393);
				float g = (color.b * 0.168) + (color.g * 0.686) + (color.r * 0.349);
				float b = (color.b * 0.131) + (color.g * 0.534) + (color.r * 0.272);

				color.r = r > 255.0 ? 255.0 : r;
				color.g = g > 255.0 ? 255.0 : g;
				color.b = b > 255.0 ? 255.0 : b;

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
          const r = data[i + 2] * 0.189 + data[i + 1] * 0.769 + data[i] * 0.393;
          const g = data[i + 2] * 0.168 + data[i + 1] * 0.686 + data[i] * 0.349;
          const b = data[i + 2] * 0.131 + data[i + 1] * 0.534 + data[i] * 0.272;

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;

          if (data[i] > 255) {
            data[i] = 255;
          }

          if (data[i + 1] > 255) {
            data[i + 1] = 255;
          }

          if (data[i + 2] > 255) {
            data[i + 2] = 255;
          }
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

  fabric.Image.filters.sepia.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
