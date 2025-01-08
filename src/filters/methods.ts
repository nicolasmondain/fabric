/* eslint-disable no-magic-numbers */

import globals from './globals';
import homothetic from '../methods/homothetic';

export default {

	applytothecurrenti(i:number, x:number, y:number, w:number, h:number, sw: number): boolean{

		if(w === 0 && h === 0){

			return true;

		}

		if(i % 4 === 0){

			const pixel    = i / 4;
			const currentX = pixel % sw;
			const currentY = Math.floor(pixel / sw);

			if(currentX >= x && currentX <= x + w){

				if(currentY >= y && currentY <= y + h){

					return true;

				}

			}

		}

		return false;

	},

	getxy(i:number, sw: number): Record<string, number>{

		let x = 0;
		let y = 0;

		if(i % 4 === 0){

			const pixel = i / 4;

			x = pixel % sw;
			y = Math.floor(pixel / sw);

		}

		return{x, y};

	},

	getifromxy(x:number, y:number, sw: number): number{

		return(y * sw * 4) + (x * 4);

	},

	getimagedata(src: string, frame: {width: number, height: number}): Promise<ImageData>{

		return new Promise((resolve, reject) => {

			try{

				const img = new Image();

				img.crossOrigin = 'Anonymous';

				img.onerror = () => {

					reject(new Error(`getimagedata: ${src} does not exist`));

				};

				img.onload  = () => {

					const canvas    = document.createElement('canvas');
					const finalSize = {

						width : frame.width || img.width,
						height: frame.height || img.height

					};

					canvas.width  = finalSize.width;
					canvas.height = finalSize.height;
					const context = canvas.getContext('2d');
					const h       = homothetic.gethomothetic(img.width, img.height, finalSize.width, finalSize.height);

					if(context){

						context.drawImage(img, h.x, h.y, h.w, h.h, 0, 0, finalSize.width, finalSize.height);

						resolve(context.getImageData(0, 0, finalSize.width, finalSize.height));

					}else{

						reject(new Error('getimagedata: context (getContext) is null'));

					}

				};

				img.src = src;

			}catch(error){

				reject(error);

			}

		});

	},

	getimageurl(imageData: ImageData, frame: {width: number, height: number}):string{

		let url = '';

		const canvas  = document.createElement('canvas');

		canvas.width  = frame.width;
		canvas.height = frame.height;

		const context = canvas.getContext('2d');

		if(context){

			context.putImageData(imageData, 0, 0);

			url = canvas.toDataURL();

		}

		return url;

	},

	onecolordarken(d:number, d2:number):number{

		return d > d2 ? d2 : d;

	},

	onecolorlighten(d:number, d2:number):number{

		return d < d2 ? d2 : d;

	},

	onecoloradd(d:number, d2:number):number{

		return Math.min(globals.GRADIATION_MAX, d + d2);

	},

	onecolorsubstract(d:number, d2:number):number{

		return d + d2 < globals.GRADIATION_MAX ? 0 : d + d2 - globals.GRADIATION_MAX;

	},

	onecolordodge(d:number, d2:number):number{

		return Math.abs(d2) === globals.GRADIATION_MAX ? d2 : Math.min(globals.GRADIATION_MAX, (d * globals.GRADIATION_MAX) / (globals.GRADIATION_MAX - d2));

	},

	onecolorburn(d:number, d2:number):number{

		return Math.abs(d2) === 0 ? d2 : Math.max(0, globals.GRADIATION_MAX - (((globals.GRADIATION_MAX - d) * globals.GRADIATION_MAX) / d2));

	},

	onecolorvividlight(d:number, d2:number):number{

		return Math.abs(d2) < 128 ? this.onecolorburn(d, 2 * d2) : this.onecolordodge(d, 2 * (d2 - 128));

	},

	onecolorreflect(d:number, d2:number):number{

		return d2 === globals.GRADIATION_MAX ? d2 : Math.min(globals.GRADIATION_MAX, d * d / (globals.GRADIATION_MAX - d2));

	},

	hardmix(d:number, d2:number):number{

		return this.onecolorvividlight(d, d2) < 128 ? 0 : globals.GRADIATION_MAX;

	},

	rgbtohsl(R: number, G: number, B: number): {h:number, s:number, l:number}{

		const r = R / globals.GRADIATION_MAX;
		const g = G / globals.GRADIATION_MAX;
		const b = B / globals.GRADIATION_MAX;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let   h   = (max + min) / 2;
		let   s   = (max + min) / 2;
		const l   = (max + min) / 2;

		if(max === min){

			h = 0;
			s = 0;

		}else{

			const d = max - min;

			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch(max){

				case r:
					h = ((g - b) / d) + (g < b ? 6 : 0);
					break;

				case g:
					h = ((b - r) / d) + 2;
					break;

				case b:
					h = ((r - g) / d) + 4;
					break;

				default:

			}

			h /= 6;

		}

		return{h, s, l};

	},

	huetorgb(P:number, Q:number, T:number):number{

		const p = P;
		const q = Q;
		let   t = T;

		if(t < 0){

			t += 1;

		}

		if(t > 1){

			t -= 1;

		}

		if(t < (1 / 6)){

			return p + ((q - p) * 6 * t);

		}

		if(t < (1 / 2)){

			return q;

		}

		if(t < (2 / 3)){

			return p + ((q - p) * ((2 / 3) - t) * 6);

		}

		return p;

	},

	hsltorgb(h:number, s:number, l:number): {r:number, g:number, b:number} {

		let r = 0;
		let g = 0;
		let b = 0;

		if(s === 0){

			r = l;
			g = l;
			b = l;

		}else{

			const q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
			const p = (2 * l) - q;

			r = this.huetorgb(p, q, h + (1 / 3));
			g = this.huetorgb(p, q, h);
			b = this.huetorgb(p, q, h - (1 / 3));

		}

		return{r: r * globals.GRADIATION_MAX, g: g * globals.GRADIATION_MAX, b: b * globals.GRADIATION_MAX};

	}

};
