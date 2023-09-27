
/* eslint-disable no-unused-vars, no-undef */

import 'emscripten';

export type rgb               = [number, number, number];
export type rgba              = [number, number, number, number];
export type homothetic        = {x:number, y:number, w:number, h:number, r: number};
export type incrustation      = {a: number; x: number; y: number; w: number; h: number;};
export type frame             = {width: number; height: number;};
export type position          = Record<string, any>;
export type library           = Record<string, any>;
export type module            = Record<string, any>;
export type filtersExtensions = Record<string, (f: library) => void>;
export type filtersType       = 'js' | 'webgl';
export type filtersDataArray  = Array<number,  rgb>;
export type filtersDataObject = {

	desaturate  : boolean;
	r           : Array<number>;
	g           : Array<number>;
	b           : Array<number>;
	a           : Array<number>;

};

export type filtersCreate = {

	length  : number;
	actions : Array<string>;
	preview : number;
	refresh : boolean;
	force   : 'js'|'webgl'|'auto';
	medias  : 'standard'|'session';

};

export type filtersData       = filtersDataArray | filtersDataObject;
export type filtersDataModule = Record<string, filtersData>;
export type filtersOptions    = {

	useBy?       : string;
	homothetic?  : homothetic;
	imageData2?  : string | ImageData;
	imageData3?  : string | ImageData;
	value1?      : number | boolean | string;
	value2?      : number | boolean | string;
	json? 	     : string | filtersDataObject;
	frame?       : frame;
	media?       : {type: string; index: number;};
	process?     : 'current' | 'original';
	incrustation?: incrustation;
	canvas?			 : Fabric.Canvas;

};

export type filtersAction  = {name: string, parameters: filtersOptions};
export type filtersActions = Array<filtersAction>;
export type filtersConfig  = {

	name    : string;
	test 		: boolean;
	active  : boolean;
	actions : filtersActions;
	type    : string;
	force   : 'js'|'webgl'|'auto';
	medias  : 'standard'|'session';

}

export type filtersConfigModule     = Record<string, filtersConfig>;
export type filtersApplyTo2dOptions = {

	imageData        : ImageData;
	originalImageData: ImageData;
	sourceWidth      : number;
	sourceHeight     : number;
	ctx              : CanvasRenderingContext2D;
	canvasEl         : HTMLCanvasElement;

};

export type filtersApplyToWebglOptions = {

	originalWidth  : number;
	originalHeight : number;
	sourceWidth    : number;
	sourceHeight   : number;
	context        : WebGLRenderingContext;
	sourceTexture  : unknown;
	targetTexture  : unknown
	originalTexture: unknown
	passes         : number;
	webgl          : boolean;
	squareVertices : unknown
	programCache   : WebGLProgramCache;
	pass           : number;
	filterBackend  : unknown;

};

export type fabricImage = HTMLImageElement & {

	homothetic? : homothetic;
	incrustation: {a: number; x: number; y: number; w: number; h: number;};
	_element    : HTMLImageElement;
	filters     : Array<any>;
	cacheKey    : string;
	canvas      : HTMLCanvasElement & {

		width           : number;
		height          : number;
		ratio           : number;
		toDataURL       : (options:Record) => string;
		requestRenderAll: () => void;
		add             : (element: fabricImage) => void;
		clone           : (any) => void;
		toJSON          : () => void;

	};
	applyFilters: () => void;
	toDataURL   : (options:Record) => string;
	left				: number;
	top					: number;
	width				: number;
	height			: number;
	scaleX			: number;
	scaleY			: number;
	cropX				: number;
	cropY				: number;
	ratio				: number;
	setElement  : (element: HTMLImageElement) => void;
	cloneAsImage: (callback: (image: fabricImage) => void) => void;

};
export interface filtersModule {

	config: filtersConfigModule;
	extend: (fabric: library) => library;
	params: (name: string, medias: Array<{index:number, type: string, src: string}>, prefix: string) => filtersConfig;
	data	: (name: string) => filtersData;
	remove: (image: fabricImage) => void;
	apply : (image: fabricImage, options: filtersOptions) => Promise<void>;

}

export interface CModule extends EmscriptenModule {

	ccall: ccall,
	cwrap: cwrap

}

export type filtersAvailable = Record<string, (f: library, image: fabricImage, options: filtersOptions) => Promise<fabricImage|void>>;

