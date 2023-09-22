import {CModule, homothetic} from '../../@types/index';
import methods from '../methods';

export const webassembly_ = (data: Uint8ClampedArray, data2: Uint8ClampedArray, h: homothetic, sourceWidth: number, sourceHeight: number, c?: CModule|undefined) => {

	if(typeof c === 'undefined'){

		if(data.length === data2.length){

			for(let i = 0; i < data.length; i += 4){

				if(methods.applytothecurrenti(i, h.x, h.y, h.w, h.h, sourceWidth)){

					data[i]     = Math.min(255, data[i] + data2[i]);
					data[i + 1] = Math.min(255, data[i + 1] + data2[i + 1]);
					data[i + 2] = Math.min(255, data[i + 2] + data2[i + 2]);

				}

			}

		}

	}else{

		const databytes    = data.length * data.BYTES_PER_ELEMENT;
		const data2bytes   = data2.length * data2.BYTES_PER_ELEMENT;
		const datapointer  = c._malloc(databytes);
		const data2pointer = c._malloc(data2bytes);
		const dataheap     = new Uint8ClampedArray(c.HEAPU8.buffer, datapointer, databytes);
		const data2heap    = new Uint8ClampedArray(c.HEAPU8.buffer, data2pointer, data2bytes);

		dataheap.set(new Uint8ClampedArray(data.buffer));
		data2heap.set(new Uint8ClampedArray(data2.buffer));

		const webassembly = c.cwrap('webassembly', null, [

			'number', // data
			'number', // data.length
			'number', // data2
			'number', // data2.length
			'number', // h.x
			'number', // h.y
			'number', // h.w
			'number', // h.h
			'number'	// sourceWidth

		]);

		webassembly(dataheap.byteOffset, dataheap.length, data2heap.byteOffset, data2heap.length, h.x, h.y, h.w, h.h, sourceWidth);

		// Converting WASM data to JS Image data
		// const update = c.HEAPU8.subarray(datapointer, datapointer + data.length);
		// const update = new Uint8ClampedArray(dataheap.buffer, dataheap.byteOffset, dataheap.length);

		const update = new Uint8ClampedArray(dataheap.buffer, dataheap.byteOffset, dataheap.length);

		for(let i = 0; i < data.length; i += 4){

			data[i]     = update[i];
			data[i + 1] = update[i + 1];
			data[i + 2] = update[i + 2];

		}

		c._free(datapointer);
		c._free(data2pointer);

	}

};
