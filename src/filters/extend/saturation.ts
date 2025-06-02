/* eslint-disable max-lines-per-function */

import { filtersApplyTo2dOptions, homothetic, library } from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const saturation = (fabric: library) => {
  fabric.Image.filters.saturation = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'saturation',
    fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;
			uniform float uValue1;

			float huetorgb(float p, float q, float t){

				if(t < 0.0){

					t += 1.0;

				}

				if(t > 1.0){

					t -= 1.0;

				}

				if(t < (1.0 / 6.0)){

					return p + ((q - p) * 6.0 * t);

				}

				if(t < (1.0 / 2.0)){

					return q;

				}

				if(t < (2.0 / 3.0)){

					return p + ((q - p) * ((2.0 / 3.0) - t) * 6.0);

				}

				return p;

			}

			vec3 rgbtohsl(float r, float g, float b){

				r /= 255.0;
				g /= 255.0;
				b /= 255.0;

				float max = max(max(r, g), b);
				float min = min(min(r, g), b);
				float h   = (max + min) / 2.0;
				float s   = (max + min) / 2.0;
				float l   = (max + min) / 2.0;

				if(max == min){

					h = 0.0;
					s = 0.0;

				}else{

					float d = max - min;

					s = l > 0.5 ? d / (2.0 - max - min) : d / (max + min);

					if(max == r){

						h = ((g - b) / d) + (g < b ? 6.0 : 0.0);

					}else if(max == g){

						h = ((b - r) / d) + 2.0;

					}else if(max == b){

						h = ((r - g) / d) + 4.0;

					}

					h /= 6.0;

				}

				return vec3(h, s, l);

			}

			vec3 hsltorgb(float h, float s, float l){

				float r = 0.0;
				float g = 0.0;
				float b = 0.0;

				if(s == 0.0){

					r = l;
					g = l;
					b = l;

				}else{

					float q = l < 0.5 ? l * (1.0 + s) : l + s - (l * s);
					float p = (2.0 * l) - q;

					r = huetorgb(p, q, h + (1.0 / 3.0));
					g = huetorgb(p, q, h);
					b = huetorgb(p, q, h - (1.0 / 3.0));

				}

				return vec3(r * 255.0, g * 255.0, b * 255.0);

			}

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord) * 255.0;
				vec3 hsl   = rgbtohsl(color.r, color.g, color.b);

				hsl[1] = hsl[1] + (uValue1 / 100.0);

				if(hsl[1] < 0.0){

					hsl[1] = 0.0;

				}

				if(hsl[1] > 1.0){

					hsl[1] = 1.0;

				}

				vec3 rgb = hsltorgb(hsl[0], hsl[1], hsl[2]);

				color.r = rgb[0];
				color.g = rgb[1];
				color.b = rgb[2];

				gl_FragColor = color / 255.0;

			}

		`,
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    value1: 0,
    mainParameter: 'useBy',
    process: 'current',
    configuration: { value1: 'Number' },
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
          const hsl = methods.rgbtohsl(data[i], data[i + 1], data[i + 2]);

          hsl.s += this.value1 / 100.0;

          if (hsl.s < 0) {
            hsl.s = 0;
          }

          if (hsl.s > 1) {
            hsl.s = 1;
          }

          const rgb = methods.hsltorgb(hsl.h, hsl.s, hsl.l);

          data[i] = rgb.r;
          data[i + 1] = rgb.g;
          data[i + 2] = rgb.b;
        }
      }
    },
    getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram) {
      return {
        uHomothetic: gl.getUniformLocation(program, 'uHomothetic'),
        uValue1: gl.getUniformLocation(program, 'uValue1'),
      };
    },
    sendUniformData(
      gl: WebGLRenderingContext,
      uniformLocations: { [key: string]: WebGLUniformLocation }
    ) {
      gl.uniform1f(uniformLocations.uHomothetic, this.homothetic || globals.HOMOTHETIC_DEFAULT);
      gl.uniform1f(uniformLocations.uValue1, this.value1 || 0);
    },
  });

  fabric.Image.filters.saturation.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
