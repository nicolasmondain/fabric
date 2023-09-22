/* eslint-disable max-lines-per-function */

import {filtersApplyTo2dOptions, filtersDataObject, homothetic, library} from '../../@types';

import globals from '../globals';
import methods from '../methods';

export const matrice = (fabric: library) => {

	fabric.Image.filters.matrice = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

		type          : 'matrice',
		fragmentSource: `

			precision highp float;
			uniform sampler2D uTexture;
			varying vec2 vTexCoord;
			uniform float uJsonR[256];
			uniform float uJsonG[256];
			uniform float uJsonB[256];

			void main(){

				vec4 color = texture2D(uTexture, vTexCoord) * 255.0;

				int r = int(color.r);
				int g = int(color.g);
				int b = int(color.b);

				for(int i = 0; i < 256; i++){

					if(r == i){

						color.r = uJsonR[i];

					}

					if(g == i){

						color.g = uJsonG[i];

					}

					if(b == i){

						color.b = uJsonB[i];

					}

				}

				gl_FragColor = color / 255.0;

			}

		`,
		useBy        : '',
		homothetic   : globals.HOMOTHETIC_DEFAULT as homothetic,
		json         : {} as filtersDataObject,
		mainParameter: 'useBy',
		process      : 'current',
		configuration: {json: 'filtersDataObject'},
		description  : '',
		applyTo2d(options: filtersApplyTo2dOptions){

			const {data} = this.process === 'current' ? options.imageData : options.originalImageData;
			const n      = data.length;

			for(let i = 0; i < n; i += 4){

				if(methods.applytothecurrenti(i, this.homothetic.x, this.homothetic.y, this.homothetic.w, this.homothetic.h, options.sourceWidth)){

					data[i]     = this.json.r[data[i]];
					data[i + 1] = this.json.g[data[i + 1]];
					data[i + 2] = this.json.b[data[i + 2]];

				}

			}

		},
		getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram){

			return{

				uHomothetic: gl.getUniformLocation(program, 'uHomothetic'),
				uJsonR     : gl.getUniformLocation(program, 'uJsonR'),
				uJsonG     : gl.getUniformLocation(program, 'uJsonG'),
				uJsonB     : gl.getUniformLocation(program, 'uJsonB')

			};

		},
		sendUniformData(gl: WebGLRenderingContext, uniformLocations: {[key: string]: WebGLUniformLocation}){

			gl.uniform1f(uniformLocations.uHomothetic, this.homothetic || globals.HOMOTHETIC_DEFAULT);
			gl.uniform1fv(uniformLocations.uJsonR, this.json?.r || []);
			gl.uniform1fv(uniformLocations.uJsonG, this.json?.g || []);
			gl.uniform1fv(uniformLocations.uJsonB, this.json?.b || []);

		}

	});

	fabric.Image.filters.matrice.fromObject = fabric.Image.filters.BaseFilter.fromObject;

};
