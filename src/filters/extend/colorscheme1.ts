/* eslint-disable max-lines-per-function, array-element-newline, max-statements */

import {
  filtersApplyTo2dOptions,
  filtersApplyToWebglOptions,
  filtersDataArray,
  homothetic,
  library,
} from '../../@types';

import filtersdata from '../data';
import globals from '../globals';
import methods from '../methods';

export const colorscheme1 = (fabric: library) => {
  fabric.Image.filters.colorscheme1 = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'colorscheme1',
    vertexSource: `

			attribute vec2 aPosition;
			varying vec2 vTexCoord;

			void main(){

				vTexCoord   = aPosition;
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

				int r = int(color.r);
				int g = int(color.g);
				int b = int(color.b);

				float value1 = 100.0 - uValue1;

				for(int i = 0; i < 256; i++){

					vec4 color2 = texture2D(uImageData2, vec2(float(i) / 255.0, 0.0));

					if(r == i){

						color.r = 0.01 * ((color.r * value1) + (uValue1 * color2.b));

					}

					if(g == i){

						color.g = 0.01 * ((color.g * value1) + (uValue1 * color2.g));

					}

					if(b == i){

						color.b = 0.01 * ((color.b * value1) + (uValue1 * color2.r));

					}

				}

				gl_FragColor = color / 255.0;

			}

		`,
    useBy: '',
    homothetic: globals.HOMOTHETIC_DEFAULT as homothetic,
    imageData2: null,
    scheme: filtersdata.colorscheme1 as filtersDataArray,
    value1: 0,
    mainParameter: 'useBy',
    process: 'current',
    configuration: { imageData2: 'HTMLImageElement', value1: 'Number' },
    description: '',
    applyTo2d(options: filtersApplyTo2dOptions) {
      const { data } = this.process === 'current' ? options.imageData : options.originalImageData;
      const n = data.length;
      const value1 = 100 - this.value1;

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
          data[i] = 0.01 * (data[i] * value1 + this.value1 * filtersdata.colorscheme1[data[i]][2]);
          data[i + 1] =
            0.01 * (data[i + 1] * value1 + this.value1 * filtersdata.colorscheme1[data[i + 1]][1]);
          data[i + 2] =
            0.01 * (data[i + 2] * value1 + this.value1 * filtersdata.colorscheme1[data[i + 2]][0]);
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
      const cacheKey = `${this.type}-${this.useBy}-${this.homothetic.x}-${this.homothetic.y}-${this.homothetic.w}-${this.homothetic.h}`;
      const width = this.scheme.length;
      const height = 1;
      const scheme = [];

      for (let i = 0; i < this.scheme.length; i += 1) {
        scheme.push(this.scheme[i][0]);
        scheme.push(this.scheme[i][1]);
        scheme.push(this.scheme[i][2]);
        scheme.push(255);
      }

      const gl = options.context;
      const buffer = new Float32Array(width * height * 4);

      gl.getExtension('OES_texture_float');
      buffer.set(scheme);

      let texture = {} as WebGLTexture;

      if (this.textureCache && this.textureCache[cacheKey]) {
        texture = this.textureCache[cacheKey] as WebGLTexture;
      } else {
        texture = gl.createTexture() as WebGLTexture;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, buffer);

        if (!this.textureCache) {
          this.textureCache = {};
        }

        this.textureCache[cacheKey] = texture;
      }

      this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
      this.callSuper('applyToWebGL', options);
      this.unbindAdditionalTexture(gl, gl.TEXTURE1);
    },
    getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram) {
      return {
        uImageData2: gl.getUniformLocation(program, 'uImageData2'),
        uHomothetic: gl.getUniformLocation(program, 'uHomothetic'),
        uValue1: gl.getUniformLocation(program, 'uValue1'),
      };
    },
    sendUniformData(
      gl: WebGLRenderingContext,
      uniformLocations: { [key: string]: WebGLUniformLocation }
    ) {
      gl.uniform1i(uniformLocations.uImageData2, 1);
      gl.uniform1f(uniformLocations.uHomothetic, this.homothetic || globals.HOMOTHETIC_DEFAULT);
      gl.uniform1f(uniformLocations.uValue1, this.value1 || 0);
    },
  });

  fabric.Image.filters.colorscheme1.fromObject = fabric.Image.filters.BaseFilter.fromObject;
};
