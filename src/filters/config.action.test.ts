import {filtersConfigModule} from '../@types';

const filtersConfigActionTest = {

	actionadd: {
		name   : 'add',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'add', parameters: {imageData2: 'various.png'}}

		]
	},
	actionadjustbrightness: {
		name   : 'adjustbrightness',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'adjustbrightness', parameters: {value1: 50}}

		]
	},
	actionaverage: {
		name   : 'average',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'average', parameters: {value1: 50, value2: 100, imageData2: 'various.png'}}

		]
	},
	actioncolorburn: {
		name   : 'colorburn',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorburn', parameters: {imageData2: 'various.png'}}

		]
	},
	actioncolordodge: {
		name   : 'colordodge',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colordodge', parameters: {imageData2: 'various.png'}}

		]
	},
	actioncurvefromfile: {
		name   : 'curvefromfile',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'curvefromfile', parameters: {imageData2: 'curvefromfile.png'}}

		]
	},
	actioncolorscheme1: {
		name   : 'colorscheme1',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme1', parameters: {value1: 100}}

		]
	},
	actioncolorscheme2: {
		name   : 'colorscheme2',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme2', parameters: {value1: 100}}

		]
	},
	actioncolorscheme3: {
		name   : 'colorscheme3',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'colorscheme3', parameters: {value1: 100}}

		]
	},
	actiondarken: {
		name   : 'darken',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'darken', parameters: {imageData2: 'various.png'}}

		]
	},
	actiondesaturate: {
		name   : 'desaturate',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'desaturate', parameters: {}}

		]
	},
	actiondifference: {
		name   : 'difference',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'difference', parameters: {imageData2: 'various.png'}}

		]
	},
	actionexclusion: {
		name   : 'exclusion',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'exclusion', parameters: {imageData2: 'various.png'}}

		]
	},
	actiongaussianblur: {
		name   : 'gaussianblur',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'js',
		medias : 'standard',
		actions: [

			{name: 'gaussianblur', parameters: {value1: 2}}

		]
	},
	actionsharpen: {
		name   : 'sharpen',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'sharpen', parameters: {}}

		]
	},
	actionbilateral: {
		name   : 'bilateral',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'js',
		medias : 'standard',
		actions: [

			{name: 'bilateral', parameters: {value1: 15, value2: 30}}

		]
	},
	actionblur: {
		name   : 'blur',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'js',
		medias : 'standard',
		actions: [

			{name: 'blur', parameters: {}}

		]
	},
	actionglow: {
		name   : 'glow',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'glow', parameters: {imageData2: 'various.png'}}

		]
	},
	actiongrayscale: {
		name   : 'grayscale',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'grayscale', parameters: {}}

		]
	},
	actionhardlight: {
		name   : 'hardlight',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'hardlight', parameters: {imageData2: 'various.png'}}

		]
	},
	actionhardmix: {
		name   : 'hardmix',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'hardmix', parameters: {imageData2: 'various.png'}}

		]
	},
	actioninvert: {
		name   : 'invert',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'invert', parameters: {}}

		]
	},
	actionlenticular: {
		name   : 'lenticular',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'js',
		medias : 'standard',
		actions: [

			{name: 'lenticular', parameters: {imageData2: 'various.png'}}

		]
	},
	actionlighten: {
		name   : 'lighten',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'lighten', parameters: {imageData2: 'various.png'}}

		]
	},
	actionlinearlight: {
		name   : 'linearlight',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'linearlight', parameters: {imageData2: 'various.png'}}

		]
	},
	actionluth256: {
		name   : 'luth256',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'luth256', parameters: {value1: true, imageData2: 'luth256.png'}}

		]
	},
	actionmatrice: {
		name   : 'matrice',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'matrice', parameters: {json: 'nashville'}}

		]
	},
	actionmultiply: {
		name   : 'multiply',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'multiply', parameters: {imageData2: 'various.png'}}

		]
	},
	actionnegate: {
		name   : 'negate',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'negate', parameters: {imageData2: 'various.png'}}

		]
	},
	actionoverlay: {
		name   : 'overlay',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'overlay', parameters: {imageData2: 'various.png'}}

		]
	},
	actionphoenix: {
		name   : 'phoenix',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'phoenix', parameters: {imageData2: 'various.png'}}

		]
	},
	actionpinlight: {
		name   : 'pinlight',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'pinlight', parameters: {imageData2: 'various.png'}}

		]
	},
	actionreflect: {
		name   : 'reflect',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'reflect', parameters: {imageData2: 'various.png'}}

		]
	},
	actionsaturation: {
		name   : 'saturation',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'saturation', parameters: {value1: 30}}

		]
	},
	actionscreen: {
		name   : 'screen',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'screen', parameters: {value1: 30, imageData2: 'various.png'}}

		]
	},
	actionsepia: {
		name   : 'sepia',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'sepia', parameters: {}}

		]
	},
	actionsoftlight: {
		name   : 'softlight',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'softlight', parameters: {imageData2: 'various.png'}}

		]
	},
	actionsubstract: {
		name   : 'substract',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'substract', parameters: {imageData2: 'various.png'}}

		]
	},
	actiontreshold: {
		name   : 'treshold',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'treshold', parameters: {value1: 30}}

		]
	},
	actionvividlight: {
		name   : 'vividlight',
		test   : true,
		active : false,
		type   : 'action',
		force  : 'auto',
		medias : 'standard',
		actions: [

			{name: 'vividlight', parameters: {imageData2: 'various.png'}}

		]
	}

};

export default filtersConfigActionTest as filtersConfigModule;
