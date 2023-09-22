import {filtersConfigModule} from '../@types';

const filtersConfigStandard = {

	alabamalightfull: {

		name   : 'alabamalightfull',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme1', parameters: {value1: 100}},
			{name: 'colorscheme2', parameters: {value1: 100}}

		]

	},
	arianablack: {
		name   : 'arianablack',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'arianablack.png'}},
			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'saturation', parameters: {value1: 20}}

		]
	},
	beautyskin: {
		name   : 'beautyskin',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'saturation', parameters: {value1: -11}},
			{name: 'adjustbrightness', parameters: {value1: 60}},
			{name: 'colorscheme2', parameters: {value1: 26}},
			{name: 'colorscheme2', parameters: {value1: 26}}

		]
	},
	blackandwhite: {
		name   : 'blackandwhite',
		test   : false,
		active : true,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'grayscale', parameters: {}}

		]
	},
	blackandwhitepulpfiction: {
		name   : 'blackandwhitepulpfiction',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'saturation', parameters: {value1: -100}}

		]
	},
	brannan: {
		name   : 'brannan',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'brannan'}}

		]
	},
	emiliasun: {
		name   : 'emiliasun',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'emiliasun.png'}},
			{name: 'colorscheme1', parameters: {value1: 100}},
			{name: 'colorscheme3', parameters: {value1: 100}},
			{name: 'saturation', parameters: {value1: 20}}

		]
	},
	goldone: {
		name   : 'goldone',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'goldone.png'}},
			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'colorscheme3', parameters: {value1: 100}}

		]
	},
	goldthree: {
		name   : 'goldthree',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'goldthree.png'}},
			{name: 'colorscheme1', parameters: {value1: 100}},
			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'colorscheme3', parameters: {value1: 100}}

		]
	},
	goldtwo: {
		name   : 'goldtwo',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'goldtwo.png'}},
			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'colorscheme3', parameters: {value1: 100}}

		]
	},
	gotham: {
		name   : 'gotham',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'gotham'}}

		]
	},
	hefe: {
		name   : 'hefe',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'hefe'}}

		]
	},
	leana: {
		name   : 'leana',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'saturation', parameters: {value1: 20}}

		]
	},
	lighten: {
		name   : 'lighten',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme2', parameters: {value1: 50}}

		]
	},
	lordkelvin: {
		name   : 'lordkelvin',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'lordkelvin'}}

		]
	},
	luth256: {
		name   : 'luth256',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'luth256', parameters: {value1: true, imageData2: 'luth256.png'}}

		]
	},
	magnaclear: {
		name   : 'magnaclear',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme1', parameters: {value1: 100}},
			{name: 'colorscheme3', parameters: {value1: 100}},
			{name: 'saturation', parameters: {value1: -50}}

		]
	},
	milano: {
		name   : 'milano',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'saturation', parameters: {value1: -100}},
			{name: 'colorscheme2', parameters: {value1: 90}}

		]
	},
	multiply: {
		name   : 'multiply',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'various.png'}}

		]
	},
	nashville: {
		name   : 'nashville',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'nashville'}}

		]
	},
	nineteenseventeen: {
		name   : 'nineteenseventeen',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'nineteenseventeen'}}

		]
	},
	nomadold: {
		name   : 'nomadold',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'nomadold.png'}},
			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'saturation', parameters: {value1: 20}}

		]
	},
	palermo: {
		name   : 'palermo',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'palermo.png'}},
			{name: 'colorscheme1', parameters: {value1: 100}},
			{name: 'colorscheme2', parameters: {value1: 100}}

		]
	},
	sepia: {
		name   : 'sepia',
		test   : false,
		active : true,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'sepia', parameters: {}}

		]
	},
	sinamono: {
		name   : 'sinamono',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'sinamono.png'}},
			{name: 'saturation', parameters: {value1: -100}},
			{name: 'colorscheme2', parameters: {value1: 100}}

		]
	},
	whitebackdropenhancer: {
		name   : 'whitebackdropenhancer',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme2', parameters: {value1: 100}},
			{name: 'saturation', parameters: {value1: 50}}

		]
	},
	xproii: {
		name   : 'xproii',
		test   : false,
		active : false,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'xproii'}}

		]
	},
	nofilter: {
		name   : 'nofilter',
		test   : false,
		active : true,
		type   : 'standard',
		force  : 'auto',
		medias : 'standard',
		actions: []
	}

};

export default filtersConfigStandard as filtersConfigModule;
