import {library} from '../@types/index';

import {add} from './extend/add';
import {adjustbrightness} from './extend/adjustbrightness';
import {average} from './extend/average';
import {beautyfilter} from './extend/beautyfilter';
import {bilateral} from './extend/bilateral';
import {blur} from './extend/blur';
import {colorburn} from './extend/colorburn';
import {colordodge} from './extend/colordodge';
import {colorscheme1} from './extend/colorscheme1';
import {colorscheme2} from './extend/colorscheme2';
import {colorscheme3} from './extend/colorscheme3';
import {curvefromfile} from './extend/curvefromfile';
import {darken} from './extend/darken';
import {desaturate} from './extend/desaturate';
import {difference} from './extend/difference';
import {exclusion} from './extend/exclusion';
import {gaussianblur} from './extend/gaussianblur';
import {glow} from './extend/glow';
import {grayscale} from './extend/grayscale';
import {hardlight} from './extend/hardlight';
import {hardmix} from './extend/hardmix';
import {invert} from './extend/invert';
import {lenticular} from './extend/lenticular';
import {lighten} from './extend/lighten';
import {linearlight} from './extend/linearlight';
import {luth256} from './extend/luth256';
import {matrice} from './extend/matrice';
import {multiply} from './extend/multiply';
import {negate} from './extend/negate';
import {overlay} from './extend/overlay';
import {phoenix} from './extend/phoenix';
import {pinlight} from './extend/pinlight';
import {reflect} from './extend/reflect';
import {replace} from './extend/replace';
import {saturation} from './extend/saturation';
import {screen} from './extend/screen';
import {sepia} from './extend/sepia';
import {sharpen} from './extend/sharpen';
import {softlight} from './extend/softlight';
import {substract} from './extend/substract';
import {treshold} from './extend/treshold';
import {vividlight} from './extend/vividlight';

// import {webassembly} from './extend/webassembly';

const methods: Record<string, (f: library) => void> = { // eslint-disable-line no-unused-vars

	add,
	adjustbrightness,
	average,
	beautyfilter,
	bilateral,
	blur,
	colorburn,
	colordodge,
	colorscheme1,
	colorscheme2,
	colorscheme3,
	curvefromfile,
	darken,
	desaturate,
	difference,
	exclusion,
	gaussianblur,
	glow,
	grayscale,
	hardlight,
	hardmix,
	invert,
	lenticular,
	lighten,
	linearlight,
	luth256,
	matrice,
	multiply,
	negate,
	overlay,
	phoenix,
	pinlight,
	reflect,
	replace,
	saturation,
	screen,
	sepia,
	sharpen,
	softlight,
	substract,
	treshold,
	vividlight

	// webassembly

	// Composed.filters

};

export const extend = (fabric: library): Record<string, (f: library) => void> => { // eslint-disable-line no-unused-vars

	fabric.extended.backendWebgl    = new fabric.WebglFilterBackend({tileSize: fabric.textureSize});
	fabric.extended.backendCanvas2d = new fabric.Canvas2dFilterBackend();
	fabric.initFilterBackend        = () => {

		if(fabric.enableGLFiltering && fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize)){

			return fabric.extended.backendWebgl;

		}else if(fabric.Canvas2dFilterBackend){

			return fabric.extended.backendCanvas2d;

		}

		return null;

	};

	const extensions = Object.keys(methods);

	for(let i = 0; i < extensions.length; i += 1){

		methods[extensions[i]](fabric);

	}

	return methods;

};
