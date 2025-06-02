/* eslint-disable max-lines-per-function, array-element-newline */

import {
  fabricImage,
  filtersApplyTo2dOptions,
  filtersApplyToWebglOptions,
  homothetic,
  library,
} from '../../@types';
import { WebglFilterBackend } from 'fabric/fabric-impl';

import globals from '../globals';
import methods from '../methods';

export const pinlight = (fabric: library) => {
  fabric.Image.filters.pinlight = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'pinlight',
    vertexSource: `

			attribute vec2 aPosition;
			varying vec2 vTexCoord;
			varying vec2 vTexCoord2;
			uniform mat4 uTransformMatrix;

			void main(){

				vTexCoord   = aPosition;
				vTexCoord2  = (uTransformMatrix * vec4(aPosition, 0.0, 1.0)).xy;
				gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);

			}

		`,
    fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			uniform sampler2D uImageData2;
			varying vec2 vTexCoord;
			varying vec2 vTexCoord2;

			float onecolordarken(float d, float d2){

				return d > d2 ? d2 : d;

			}

			float onecolorlighten(float d, float d2){

				return d < d2 ? d2 : d;

			}

			void main(){

				vec4 color  = texture2D(uTexture, vTexCoord) * 255.0;
				vec4 color2 = texture2D(uImageData2, vTexCoord2) * 255.0;

				color.r = color2.r < 128.0 ? onecolordarken(color.r, 2.0 * color2.r) : onecolorlighten(color.r, 2.0 * (color2.r - 128.0));
				color.g = color2.g < 128.0 ? onecolordarken(color.g, 2.0 * color2.g) : onecolorlighten(color.g, 2.0 * (color2.g - 128.0));
				color.b = color2.b < 128.0 ? onecolordarken(color.b, 2.0 * color2.b) : onecolorlighten(color.b, 2.0 * (color2.b - 128.0));

				gl_FragColor = color / 255.0;

			}

		`,
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    imageData2: null,
    mainParameter: 'useBy',
    process: 'current',
    configuration: { imageData2: 'HTMLImageElement' },
    description: '',
    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    applyTo2d(options: filtersApplyTo2dOptions) {
      const { data } = this.process === 'current' ? options.imageData : options.originalImageData;
      const n = data.length;
      const data2 = this.imageData2.data;
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
            data[i] =
              data2[i] < 128
                ? methods.onecolordarken(data[i], 2 * data2[i])
                : methods.onecolorlighten(data[i], 2 * (data2[i] - 128));
            data[i + 1] =
              data2[i + 1] < 128
                ? methods.onecolordarken(data[i + 1], 2 * data2[i + 1])
                : methods.onecolorlighten(data[i + 1], 2 * (data2[i + 1] - 128));
            data[i + 2] =
              data2[i + 2] < 128
                ? methods.onecolordarken(data[i + 2], 2 * data2[i + 2])
                : methods.onecolorlighten(data[i + 2], 2 * (data2[i + 2] - 128));
          }
        }
      }
    },
    retrieveFragmentSource(replaces: Array<{ search: string; replace: any }>) {
      let { fragmentSource } = this;

      for (let i = 0; i < replaces.length; i += 1) {
        fragmentSource = fragmentSource.replace(
          new RegExp(replaces[i].search, 'gu'),
          replaces[i].replace
        );
      }

      return fragmentSource;
    },
    retrieveShader(options: filtersApplyToWebglOptions) {
      if (typeof this.retrieveFragmentSource === 'function') {
        this.fragmentSource = this.retrieveFragmentSource([
          { search: '__OPTIONS_SOURCEWIDTH__', replace: `${options.sourceWidth}.0` },
          { search: '__OPTIONS_SOURCEHEIGHT__', replace: `${options.sourceHeight}.0` },
        ]);
      }

      const cacheKey = `${this.type}-${this.useBy}-${this.homothetic.x}-${this.homothetic.y}-${this.homothetic.w}-${this.homothetic.h}`;

      if (!Object.prototype.hasOwnProperty.call(options.programCache, cacheKey)) {
        options.programCache[cacheKey] = this.createProgram(options.context, this.fragmentSource);
      }

      return options.programCache[cacheKey];
    },
    calculateMatrix() {
      return this.matrix;
    },
    applyTo(options: filtersApplyToWebglOptions) {
      if (options.webgl === true) {
        this._setupFrameBuffer(options);
        this.applyToWebGL(options);
        this._swapTextures(options);
      } else {
        this.applyTo2d(options);
      }
    },
    applyToWebGL(options: filtersApplyToWebglOptions) {
      const gl = options.context;
      const texture = this.createTexture(options.filterBackend, this.imageData2);

      this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
      this.callSuper('applyToWebGL', options);
      this.unbindAdditionalTexture(gl, gl.TEXTURE1);
    },
    createTexture(backend: WebglFilterBackend, image: fabricImage) {
      const cacheKey = `${this.type}-${this.useBy}-${this.homothetic.x}-${this.homothetic.y}-${this.homothetic.w}-${this.homothetic.h}`;

      return backend.getCachedTexture(cacheKey, image);
    },
    getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram) {
      return {
        uImageData2: gl.getUniformLocation(program, 'uImageData2'),
        uTransformMatrix: gl.getUniformLocation(program, 'uTransformMatrix'),
      };
    },
    sendUniformData(
      gl: WebGLRenderingContext,
      uniformLocations: { [key: string]: WebGLUniformLocation }
    ) {
      gl.uniform1i(uniformLocations.uImageData2, 1);
      gl.uniformMatrix4fv(uniformLocations.uTransformMatrix, false, this.calculateMatrix());
    },
  });

  fabric.Image.filters.pinlight.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
