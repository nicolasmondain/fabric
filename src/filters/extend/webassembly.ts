

/* eslint-disable */

import {CModule, fabricImage, filtersApplyTo2dOptions, filtersApplyToWebglOptions, library} from '../../@types';

import {webassembly_} from './webassembly_';
import {WebglFilterBackend} from 'fabric/fabric-impl';
import globals from '../globals';

// @ts-ignore

import Module from './webassembly_.js';

export const webassembly = (fabric: library) => {

	new Module().then((c: CModule) => { // eslint-disable-line no-unused-vars

		fabric.Image.filters.webassembly = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

			type        : 'add',
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

				void main(){

					vec4 color   = texture2D(uTexture, vTexCoord);
					vec4 color2  = texture2D(uImageData2, vTexCoord2);
					color.rgba  += color2.rgba;
					gl_FragColor = color;

				}

			`,
			useBy        : '',
			homothetic   : globals.HOMOTHETIC_DEFAULT,
			imageData2   : null,
			mainParameter: 'useBy',
			process      : 'current',
			configuration: {imageData2: 'HTMLImageElement'},
			matrix       : [

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			],
			applyTo2d(options: filtersApplyTo2dOptions){

				const {data} = this.process === 'current' ? options.imageData : options.originalImageData;
				const data2  = this.imageData2.data;

				webassembly_(data, data2, this.homothetic, options.sourceWidth, options.sourceHeight, c);

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
			createTexture: function(backend: WebglFilterBackend, image: fabricImage){

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

		fabric.Image.filters.webassembly.fromObject = fabric.Image.filters.BaseFilter.fromObject;

	});

};
