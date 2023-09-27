import {frame, homothetic, incrustation, module, position} from '../@types/index';

const CANVAS_MARGINS = 100;

export default {

	get(type: string, opts: {i: incrustation, h: homothetic, f: frame, r: number, merge?: Record<string, any>}): position{

		let p = {};

		if(Object.prototype.hasOwnProperty.call(this, type) && typeof this[type] === 'function'){

			p = this[type](opts.i, opts.h, opts.f, opts.r, opts.merge);

		}

		return p;

	},

	incrustation(i: incrustation, h: homothetic, f: frame, r: number, merge = {} as Record<string, any>): position{

		return Object.assign({}, merge, {

			crossOrigin     : 'Anonymous',
			angle           : i.a,
			left            : i.x / r,
			top             : i.y / r,
			width           : h.w,
			height          : h.h,
			scaleX          : f.width * ((i.w / r) / h.w) / f.width,
			scaleY          : f.height * ((i.h / r) / h.h) / f.height,
			cropX           : h.x,
			cropY           : h.y,
			type            : 'incrustation',
			selectable      : false,
			centeredRotation: true,
			incrustation    : i,
			homothetic      : h,
			ratio           : r

		});

	},

	background(f: frame, r: number, merge = {} as Record<string, any>){

		return Object.assign({}, merge, {

			left      : -CANVAS_MARGINS,
			top       : -CANVAS_MARGINS,
			width     : (f.width / r) + (CANVAS_MARGINS * 2),
			height    : (f.height / r) + (CANVAS_MARGINS * 2),
			selectable: false,
			type      : 'background'

		});

	},

	image(i: incrustation, h: homothetic, f: frame, r: number, merge = {} as Record<string, any>){

		return Object.assign({}, merge, {

			originX    : 'left',
			originY    : 'top',
			left       : (i.x + h.x) / r,
			top        : (i.y + h.y) / r,
			angle      : i.a,
			scaleX     : h.w / f.width / r,
			scaleY     : h.h / f.height / r,
			selectable : false,
			type       : 'image',
			crossOrigin: 'Anonymous',
			ratio      : r

		});

	},

	branding(f: frame, r: number, merge = {} as Record<string, any>){

		return Object.assign({}, merge, {

			originX   : 'left',
			originY   : 'top',
			left      : 0,
			top       : 0,
			scaleX    : (f.width / r) / f.width,
			scaleY    : (f.height / r) / f.height,
			selectable: false,
			type      : 'branding',
			ratio     : r

		});

	}

} as module;
