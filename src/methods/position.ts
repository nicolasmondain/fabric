import {frame, homothetic, incrustation, module, position} from '../@types/index';

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

	}

} as module;
