/* eslint-disable max-lines-per-function */

import {filtersApplyTo2dOptions, homothetic, library} from '../../@types';

import globals from '../globals';
import methods from '../methods';

import cv from '../../../opencv/index.js';

export const beautyfilter = (fabric: library) => {

	fabric.Image.filters.beautyfilter = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

		type         : 'beautyfilter',
		useBy        : '',
		homothetic   : globals.HOMOTHETIC_DEFAULT as homothetic,
		imageData2   : null,
		imageData3   : null,
		value1       : 0,
		mainParameter: 'useBy',
		process      : 'current',
		configuration: {imageData2: 'HTMLImageElement', imageData3: 'HTMLImageElement'},
		description  : '',
		applyTo2d(options: filtersApplyTo2dOptions){ // eslint-disable-line max-statements

			const SIGMA  = 2;
			const AMOUNT = 1.48;
			const K      = 15;
			const TH     = 30;

			// @ts-ignore

			const source = cv.matFromImageData(this.process === 'current' ? options.imageData : options.originalImageData);

			// @ts-ignore

			const bilateral = new cv.Mat();

			// @ts-ignore

			const blurry = new cv.Mat();

			// @ts-ignore

			const size = new cv.Size();

			// @ts-ignore

			cv.cvtColor(source, source, cv.COLOR_RGBA2RGB, 0);

			// @ts-ignore

			cv.bilateralFilter(source, bilateral, K, TH, TH, cv.BORDER_DEFAULT);

			// @ts-ignore

			cv.cvtColor(bilateral, bilateral, cv.COLOR_RGB2BGRA, 0);

			// @ts-ignore

			const BILATERAL_IMAGE = new ImageData(new Uint8ClampedArray(bilateral.data, bilateral.cols, bilateral.rows), options.sourceWidth, options.sourceHeight);
			const CURVE_IMAGE     = this.imageData2;

			for(let i = 0; i < BILATERAL_IMAGE.data.length; i += 4){

				const linearPosition = BILATERAL_IMAGE.data[i] + (BILATERAL_IMAGE.data[i + 1] * 256) + (BILATERAL_IMAGE.data[i + 2] * 256 * 256);
				const j              = linearPosition * 4;

				BILATERAL_IMAGE.data[i]     = CURVE_IMAGE.data[j];
				BILATERAL_IMAGE.data[i + 1] = CURVE_IMAGE.data[j + 1];
				BILATERAL_IMAGE.data[i + 2] = CURVE_IMAGE.data[j + 2];

			}

			// @ts-ignore

			cv.cvtColor(source, source, cv.COLOR_RGB2RGBA, 0);

			// @ts-ignore

			cv.GaussianBlur(source, blurry, size, SIGMA, SIGMA, cv.BORDER_DEFAULT);

			const BLURRY_IMAGE    = new ImageData(new Uint8ClampedArray(blurry.data, blurry.cols, blurry.rows), options.sourceWidth, options.sourceHeight);
			const SHARPENED_IMAGE = new ImageData(new Uint8ClampedArray(source.data, source.cols, source.rows), options.sourceWidth, options.sourceHeight);

			for(let i = 0; i < BLURRY_IMAGE.data.length; i += 4){

				SHARPENED_IMAGE.data[i]     = (options.imageData.data[i] * (1 + AMOUNT)) + (BLURRY_IMAGE.data[i] * -AMOUNT);
				SHARPENED_IMAGE.data[i + 1] = (options.imageData.data[i + 1] * (1 + AMOUNT)) + (BLURRY_IMAGE.data[i + 1] * -AMOUNT);
				SHARPENED_IMAGE.data[i + 2] = (options.imageData.data[i + 2] * (1 + AMOUNT)) + (BLURRY_IMAGE.data[i + 2] * -AMOUNT);

			}

			for(let i = 0; i < SHARPENED_IMAGE.data.length; i += 4){

				if(BILATERAL_IMAGE.data[i] < SHARPENED_IMAGE.data[i]){

					BILATERAL_IMAGE.data[i] = SHARPENED_IMAGE.data[i];

				}

				if(BILATERAL_IMAGE.data[i + 1] < SHARPENED_IMAGE.data[i + 1]){

					BILATERAL_IMAGE.data[i + 1] = SHARPENED_IMAGE.data[i + 1];

				}

				if(BILATERAL_IMAGE.data[i + 2] < SHARPENED_IMAGE.data[i + 2]){

					BILATERAL_IMAGE.data[i + 2] = SHARPENED_IMAGE.data[i + 2];

				}

			}

			if(this.imageData3){

				const CURVE_IMAGE_BW  = this.imageData3;

				for(let i = 0; i < BILATERAL_IMAGE.data.length; i += 4){

					const linearPosition = BILATERAL_IMAGE.data[i] + (BILATERAL_IMAGE.data[i + 1] * 256) + (BILATERAL_IMAGE.data[i + 2] * 256 * 256);
					const j              = linearPosition * 4;

					BILATERAL_IMAGE.data[i]     = CURVE_IMAGE_BW.data[j];
					BILATERAL_IMAGE.data[i + 1] = CURVE_IMAGE_BW.data[j + 1];
					BILATERAL_IMAGE.data[i + 2] = CURVE_IMAGE_BW.data[j + 2];

				}

			}

			const {data} = this.process === 'current' ? options.imageData : options.originalImageData;

			for(let i = 0; i < data.length; i += 4){

				if(methods.applytothecurrenti(i, this.homothetic.x, this.homothetic.y, this.homothetic.w, this.homothetic.h, options.sourceWidth)){

					data[i]     = BILATERAL_IMAGE.data[i];
					data[i + 1] = BILATERAL_IMAGE.data[i + 1];
					data[i + 2] = BILATERAL_IMAGE.data[i + 2];

				}

			}

			source.delete();
			bilateral.delete();
			blurry.delete();

		}

	});

	fabric.Image.filters.beautyfilter.fromObject = fabric.Image.filters.BaseFilter.fromObject;

};
