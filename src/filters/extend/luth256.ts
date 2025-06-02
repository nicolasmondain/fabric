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

export const luth256 = (fabric: library) => {
  fabric.Image.filters.luth256 = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'luth256',
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
			uniform float uValue1;

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord) * 255.0;

				float v    = floor(((0.2126 * color.r) + (0.7152 * color.g) + (0.0722 * color.b)) + 0.0);
				float i    = uValue1 == 1.0 ? v : 255.0 - v;
				float y    = floor(i / __OPTIONS_SOURCEWIDTH__ + 0.0);
				float x    = floor(i - (y * __OPTIONS_SOURCEWIDTH__) + 0.0);
				vec2 res   = vec2(__OPTIONS_SOURCEWIDTH__, __OPTIONS_SOURCEHEIGHT__);
				vec2 coord = (vec2(int(x), int(y)) + 0.5) / res;

				vec4 color2 = texture2D(uImageData2, coord) * 255.0;

				color.r = color2.r;
				color.g = color2.g;
				color.b = color2.b;

				gl_FragColor = color / 255.0;

			}

		`,
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    imageData2: null,
    value1: false,
    mainParameter: 'useBy',
    process: 'current',
    configuration: { imageData2: 'HTMLImageElement', value1: 'Boolean' },
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
            let v = Math.trunc(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);

            if (this.value1) {
              v = 255 - v;
            }

            data[i] = data2[v * 4];
            data[i + 1] = data2[v * 4 + 1];
            data[i + 2] = data2[v * 4 + 2];
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
          { search: '__IMAGEDATA2_LENGTH__', replace: this.imageData2.data.length },
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
      };
    },
    sendUniformData(
      gl: WebGLRenderingContext,
      uniformLocations: { [key: string]: WebGLUniformLocation }
    ) {
      gl.uniform1i(uniformLocations.uImageData2, 1);
      gl.uniformMatrix4fv(uniformLocations.uTransformMatrix, false, this.calculateMatrix());
      gl.uniform1f(uniformLocations.uValue1, this.uValue1 ? 1 : 0);
    },
  });

  fabric.Image.filters.luth256.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
