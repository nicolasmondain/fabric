/* eslint-disable max-lines-per-function */

import {filtersApplyTo2dOptions, homothetic, library} from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const grayscale = (fabric: library) => {

	fabric.Image.filters.grayscale = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

		type          : 'grayscale',
		fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord);

				float v = (color.r + color.g + color.b) / 3.0;

				color.r = v;
				color.g = v;
				color.b = v;

				gl_FragColor = color;

			}

		`,
		useBy        : '',
		homothetic   : globals.HOMOTHETIC_DEFAULT as homothetic,
		mainParameter: 'useBy',
		process      : 'current',
		configuration: {},
		description  : '',
		applyTo2d(options: filtersApplyTo2dOptions){

			const {data} = this.process === 'current' ? options.imageData : options.originalImageData;
			const n      = data.length;

			for(let i = 0; i < n; i += 4){

				if(methods.applytothecurrenti(i, this.homothetic.x, this.homothetic.y, this.homothetic.w, this.homothetic.h, options.sourceWidth)){

					const v = (data[i] + data[i + 1] + data[i + 2]) / 3;

					data[i]     = v;
					data[i + 1] = v;
					data[i + 2] = v;

				}

			}

		},
		getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram){

			return{

				uHomothetic: gl.getUniformLocation(program, 'uHomothetic')

			};

		},
		sendUniformData(gl: WebGLRenderingContext, uniformLocations: {[key: string]: WebGLUniformLocation}){

			gl.uniform1f(uniformLocations.uHomothetic, this.homothetic || globals.HOMOTHETIC_DEFAULT);

		}

	});

	fabric.Image.filters.grayscale.fromObject = fabric.Image.filters.BaseFilter.fromObject;

};
