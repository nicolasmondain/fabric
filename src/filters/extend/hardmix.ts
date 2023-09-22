/* eslint-disable max-lines-per-function, array-element-newline */

import {fabricImage, filtersApplyTo2dOptions, filtersApplyToWebglOptions, homothetic, library} from '../../@types';
import {WebglFilterBackend} from 'fabric/fabric-impl';

import globals from '../globals';
import methods from '../methods';

export const hardmix = (fabric: library) => {

	fabric.Image.filters.hardmix = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

		type        : 'hardmix',
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

			float onecolordodge(float d, float d2){

				return abs(d2 + 0.0) == 255.0 ? d2 : min(255.0, (d * 255.0) / (255.0 - d2));

			}

			float onecolorburn(float d, float d2){

				return abs(d2 + 0.0) == 0.0 ? d2 : max(0.0, 255.0 - (((255.0 - d) * 255.0) / d2));

			}

			float onecolorvividlight(float d, float d2){

				return abs(d2 + 0.0) < 128.0 ? onecolorburn(d, 2.0 * d2) : onecolordodge(d, 2.0 * (d2 - 128.0));

			}

			float hardmix(float d, float d2){

				float h = onecolorvividlight(d, d2);
				return h < 128.0 ? 0.0 : 255.0;

			}

			void main(){

				vec4 color  = texture2D(uTexture, vTexCoord) * 255.0;
				vec4 color2 = texture2D(uImageData2, vTexCoord2) * 255.0;

				color.r = hardmix(color.r, color2.r);
				color.g = hardmix(color.g, color2.g);
				color.b = hardmix(color.b, color2.b);

				gl_FragColor = color / 255.0;

			}

		`,
		useBy        : '',
		homothetic   : globals.HOMOTHETIC_DEFAULT as homothetic,
		imageData2   : null,
		mainParameter: 'useBy',
		process      : 'current',
		configuration: {imageData2: 'HTMLImageElement'},
		description  : '',
		matrix       : [

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		],
		applyTo2d(options: filtersApplyTo2dOptions){

			const {data} = this.process === 'current' ? options.imageData : options.originalImageData;
			const n      = data.length;
			const data2  = this.imageData2.data;
			const m      = data2.length;

			if(n === m){

				for(let i = 0; i < n; i += 4){

					if(methods.applytothecurrenti(i, this.homothetic.x, this.homothetic.y, this.homothetic.w, this.homothetic.h, options.sourceWidth)){

						data[i]     = methods.hardmix(data[i], data2[i]);
						data[i + 1] = methods.hardmix(data[i + 1], data2[i + 1]);
						data[i + 2] = methods.hardmix(data[i + 2], data2[i + 2]);

					}

				}

			}

		},
		retrieveFragmentSource(replaces: Array<{search: string, replace: any}>){

			let {fragmentSource} = this;

			for(let i = 0; i < replaces.length; i += 1){

				fragmentSource = fragmentSource.replace(new RegExp(replaces[i].search, 'gu'), replaces[i].replace);

			}

			return fragmentSource;

		},
		retrieveShader(options: filtersApplyToWebglOptions){

			if(typeof this.retrieveFragmentSource === 'function'){

				this.fragmentSource = this.retrieveFragmentSource([

					{search: '__OPTIONS_SOURCEWIDTH__', replace: `${options.sourceWidth}.0`},
					{search: '__OPTIONS_SOURCEHEIGHT__', replace: `${options.sourceHeight}.0`}

				]);

			}

			const cacheKey = `${this.type}-${this.useBy}-${this.homothetic.x}-${this.homothetic.y}-${this.homothetic.w}-${this.homothetic.h}`;

			if(!Object.prototype.hasOwnProperty.call(options.programCache, cacheKey)){

				options.programCache[cacheKey] = this.createProgram(options.context, this.fragmentSource);

			}

			return options.programCache[cacheKey];

		},
		calculateMatrix(){

			return this.matrix;

		},
		applyTo(options: filtersApplyToWebglOptions){

			if(options.webgl === true){

				this._setupFrameBuffer(options);
				this.applyToWebGL(options);
				this._swapTextures(options);

			}else{

				this.applyTo2d(options);

			}

		},
		applyToWebGL(options: filtersApplyToWebglOptions){

			const gl      = options.context;
			const texture = this.createTexture(options.filterBackend, this.imageData2);

			this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
			this.callSuper('applyToWebGL', options);
			this.unbindAdditionalTexture(gl, gl.TEXTURE1);

		},
		createTexture(backend: WebglFilterBackend, image: fabricImage){

			const cacheKey = `${this.type}-${this.useBy}-${this.homothetic.x}-${this.homothetic.y}-${this.homothetic.w}-${this.homothetic.h}`;

			return backend.getCachedTexture(cacheKey, image);

		},
		getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram){

			return{

				uImageData2     : gl.getUniformLocation(program, 'uImageData2'),
				uTransformMatrix: gl.getUniformLocation(program, 'uTransformMatrix')

			};

		},
		sendUniformData(gl: WebGLRenderingContext, uniformLocations: {[key: string]: WebGLUniformLocation}){

			gl.uniform1i(uniformLocations.uImageData2, 1);
			gl.uniformMatrix4fv(uniformLocations.uTransformMatrix, false, this.calculateMatrix());

		}

	});

	fabric.Image.filters.hardmix.fromObject = fabric.Image.filters.BaseFilter.fromObject;

};

