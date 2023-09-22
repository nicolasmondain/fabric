import {filtersConfigModule} from '../@types';

const filtersConfigSpecific = {

	multiplyshoot1: {
		name   : 'multiplyshoot1',
		test   : false,
		active : false,
		type   : 'specific',
		force  : 'auto',
		medias : 'session',
		actions: [

			{name: 'multiply', parameters: {imageData2: '', media: {type: 'SHOOT', index: 1}}}

		]
	},
	lenticularshoot1: {
		name   : 'lenticularshoot1',
		test   : false,
		active : false,
		type   : 'specific',
		force  : 'js',
		medias : 'session',
		actions: [

			{name: 'lenticular', parameters: {imageData2: '', media: {type: 'SHOOT', index: 1}}}

		]
	},
	beautyfilter: {
		name   : 'beautyfilter',
		test   : false,
		active : false,
		type   : 'specific',
		force  : 'js',
		medias : 'standard',
		actions: [

			{name: 'beautyfilter', parameters: {imageData2: 'beauty.png'}}

		]
	},
	beautyfilterbw: {
		name   : 'beautyfilterbw',
		test   : false,
		active : false,
		type   : 'specific',
		force  : 'js',
		medias : 'standard',
		actions: [

			{name: 'beautyfilter', parameters: {imageData2: 'beauty.png', imageData3: 'beautybw.png'}}

		]
	}

};

export default filtersConfigSpecific as filtersConfigModule;
