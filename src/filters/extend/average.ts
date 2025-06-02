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

export const average = (fabric: library) => {
  fabric.Image.filters.average = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'average',
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
			uniform float uValue1;
			uniform float uValue2;

			void main(){

				vec4 color   = texture2D(uTexture, vTexCoord);
				vec4 color2  = texture2D(uImageData2, vTexCoord2);

				float levelSum = uValue1 + uValue2;

				color.r = (color.r * uValue1 + color2.r * uValue2) / levelSum;
				color.g = (color.g * uValue1 + color2.g * uValue2) / levelSum;
				color.b = (color.b * uValue1 + color2.b * uValue2) / levelSum;

				gl_FragColor = color;

			}

		`,
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    imageData2: null,
    value1: 0,
    value2: 0,
    configuration: { imageData2: 'HTMLImageElement', value1: 'Number', value2: 'Number' },
    description: '',
    mainParameter: 'useBy',
    process: 'current',
    matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    applyTo2d(options: filtersApplyTo2dOptions) {
      const { data } = this.process === 'current' ? options.imageData : options.originalImageData;
      const n = data.length;
      const data2 = this.imageData2.data;
      const m = data2.length;

      if (n === m) {
        const levelSum = this.value1 + this.value2;

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
            data[i] = (data[i] * this.value1 + data2[i] * this.value2) / levelSum;
            data[i + 1] = (data[i + 1] * this.value1 + data2[i + 1] * this.value2) / levelSum;
            data[i + 2] = (data[i + 2] * this.value1 + data2[i + 2] * this.value2) / levelSum;
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
        uValue1: gl.getUniformLocation(program, 'uValue1'),
        uValue2: gl.getUniformLocation(program, 'uValue2'),
      };
    },
    sendUniformData(
      gl: WebGLRenderingContext,
      uniformLocations: { [key: string]: WebGLUniformLocation }
    ) {
      gl.uniform1i(uniformLocations.uImageData2, 1);
      gl.uniformMatrix4fv(uniformLocations.uTransformMatrix, false, this.calculateMatrix());
      gl.uniform1f(uniformLocations.uValue1, this.value1);
      gl.uniform1f(uniformLocations.uValue2, this.value2);
    },
  });

  fabric.Image.filters.average.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
