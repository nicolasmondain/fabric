/* eslint-disable max-lines-per-function */

import {filtersApplyTo2dOptions, homothetic, library} from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const treshold = (fabric: library) => {

	fabric.Image.filters.treshold = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

		type          : 'treshold',
		fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;
			uniform float uValue1;

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord) * 255.0;

				float v = (0.2126 * color.r) + (0.7152 * color.g) + (0.0722 *  color.b) >= uValue1 ? 255.0 : 0.0;

				color.r = v;
				color.g = v;
				color.b = v;

				gl_FragColor = color / 255.0;

			}

		`,
		useBy        : '',
		homothetic   : globals.HOMOTHETIC_DEFAULT as homothetic,
		value1       : 0,
		mainParameter: 'useBy',
		process      : 'current',
		configuration: {value1: 'Number'},
		description  : '',
		applyTo2d(options: filtersApplyTo2dOptions){

			const {data} = this.process === 'current' ? options.imageData : options.originalImageData;
			const n      = data.length;

			for(let i = 0; i < n; i += 4){

				if(methods.applytothecurrenti(i, this.homothetic.x, this.homothetic.y, this.homothetic.w, this.homothetic.h, options.sourceWidth)){

					const v = (0.2126 * data[i]) + (0.7152 * data[i + 1]) + (0.0722 * data[i + 2]) >= this.value1 ? 255 : 0;

					data[i]     = v;
					data[i + 1] = v;
					data[i + 2] = v;

				}

			}

		},
		getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram){

			return{

				uHomothetic: gl.getUniformLocation(program, 'uHomothetic'),
				uValue1    : gl.getUniformLocation(program, 'uValue1')

			};

		},
		sendUniformData(gl: WebGLRenderingContext, uniformLocations: {[key: string]: WebGLUniformLocation}){

			gl.uniform1f(uniformLocations.uHomothetic, this.homothetic || globals.HOMOTHETIC_DEFAULT);
			gl.uniform1f(uniformLocations.uValue1, this.value1 || 0);

		}

	});

	fabric.Image.filters.treshold.fromObject = fabric.Image.filters.BaseFilter.fromObject;

};
