import {

	fabricImage,
	filtersAction,
	filtersActions,
	filtersConfig,
	filtersConfigModule,
	filtersCreate,
	filtersData,
	filtersDataModule,
	filtersExtensions,
	filtersType,
	library

} from '../@types/index';

import config from './config';
import create from './create';
import data from './data';
import {extend} from './extend';
import methods from './methods';
export class Filters {

	fabric    : library;										// fabric
	config    : filtersConfigModule; 				// configuration des filtres disponibles (image, json, test, etc)
	create    : Array<filtersCreate>;				// création de filtres fréquentes / connues
	data      : filtersDataModule;					// données associées aux filtres disponibles (json)
	extensions: filtersExtensions;					// ensemble des méthodes ajoutées à fabric pour l'application de filtres
	type      : filtersType;								// type de filtres à appliquer (server, JavaScript ou WebGL)
	ios       : boolean;										// eventManager sur iPhone ou iPad ? Détermine si nous allons utiliser le JavaScript (true) ou WebGL (false)

	constructor(fabric: library, type: filtersType = 'webgl'){

		this.fabric     = fabric;
		this.config     = config;
		this.create 	  = create;
		this.data       = data;
		this.extensions = {} as filtersExtensions;
		this.type       = type;
		this.ios        = this.type === 'js' ? true : ['iPad', 'iPhone', 'iPod'].includes(window.navigator.platform) || (window.navigator.userAgent.includes('Mac') && 'ontouchend' in window.document);

	}

	static remove(image: fabricImage): void{

		image.filters = [];

		image.applyFilters();

	}

	isusualcreation(conf: filtersConfig){

		const {actions} = conf;

		for(let i = 0; i < this.create.length; i += 1){

			if(actions.length === this.create[i].actions.length){

				for(let j = 0; j < actions.length; j += 1){

					if(actions[j].name !== this.create[i].actions[j]){

						break;

					}

					if(j + 1 === actions.length){

						return this.create[i];

					}

				}

			}

		}

		return null;

	}

	getconf(name: string, medias: Array<{index:number, type: string, src: string, path: string}>, prefix:string, actions?: filtersActions): filtersConfig{

		let conf = {} as filtersConfig;

		if(this.config[name]){

			conf = JSON.parse(JSON.stringify(this.config[name]));

			for(let i = 0; i < conf.actions.length; i += 1){

				if(conf.actions[i].parameters.media){

					const media = medias.find((m) => m.index === conf.actions[i].parameters.media?.index && m.type === conf.actions[i].parameters.media?.type); // eslint-disable-line no-loop-func

					if(media && this.type === 'server'){

						conf.actions[i].parameters.imageData2 = media.path;

					}else if(media){

						conf.actions[i].parameters.imageData2 = media.src;

					}

				}else if(conf.actions[i].parameters.imageData2 || conf.actions[i].parameters.imageData3){

					conf.actions[i].parameters.imageData2 = prefix + conf.actions[i].parameters.imageData2;
					conf.actions[i].parameters.imageData3 = prefix + conf.actions[i].parameters.imageData3;

				}

			}

		}else if(actions && Array.isArray(actions) && actions.length){

			conf = {name, actions: actions?.filter((a) => a.name && typeof this.extensions[a.name] === 'function'), test: false, active: false, type: 'custom', force: 'auto', medias: 'standard'};

			const creation = this.isusualcreation(conf);

			if(creation){

				conf.force = creation.force;

			}

		}

		return conf;

	}

	getdata(name: string): filtersData{

		if(this.data[name]){

			return this.data[name];

		}

		return{} as filtersData;

	}

	getactions(image: fabricImage, configuration: filtersConfig): filtersActions{

		let desaturate = -1;

		const actions = configuration.actions.map((a, i) => {

			a.parameters.homothetic = image.homothetic || {x: 0, y: 0, w: 0, h: 0, r: 1};
			a.parameters.frame      = {height: image._element.height, width: image._element.width};
			a.parameters.json       = this.type === 'server' ? a.parameters.json : this.getdata(a.parameters.json as string);
			a.parameters.process    = a.parameters.process ? a.parameters.process : 'current';

			if(this.type !== 'server' && typeof a.parameters.json === 'object' && a.parameters.json?.desaturate){

				desaturate = i;

			}

			return a;

		}) as filtersActions;

		if(desaturate > -1){

			actions.splice(desaturate, 0, {name: 'desaturate', parameters: {}});

		}

		return actions;

	}

	extend(): void{

		this.extensions = extend(this.fabric);

	}

	action(image: fabricImage, filter: string, actions: filtersActions): Promise<fabricImage>{ // eslint-disable-line max-lines-per-function

		const NO_RESIZE_FOR   = ['curvefromfile', 'beautyfilter', 'lenticular'];
		const LENTICULAR_CASE = ['lenticular'];

		return new Promise((resolve, reject) => { // eslint-disable-line max-lines-per-function

			try{

				const {canvas} = image;

				const accumulator = (action: filtersAction) => new Promise<void>((next) => { // eslint-disable-line max-lines-per-function, max-statements

					const option      = JSON.parse(JSON.stringify(action)) as filtersAction;
					const {prototype} = this.fabric.Image.filters[action.name];

					option.parameters.useBy        = filter;
					option.parameters.canvas       = canvas;
					option.parameters.incrustation = image.incrustation;

					const promises = [] as Array<Promise<ImageData>>;

					if(option.parameters?.frame){

						const resize = !NO_RESIZE_FOR.includes(option.name);
						const size   = resize ? option.parameters.frame : {width: 0, height: 0};

						if(typeof option.parameters?.imageData2 === 'string' && prototype.configuration.imageData2){

							promises.push(methods.getimagedata(option.parameters.imageData2, size));

						}

						if(typeof option.parameters?.imageData3 === 'string' && prototype.configuration.imageData3){

							promises.push(methods.getimagedata(option.parameters.imageData3, size));

						}

					}

					Promise.allSettled(promises).then((results) => { // eslint-disable-line max-lines-per-function

						if(results.length && results.every((result) => result?.status === 'rejected')){

							next();

							return;

						}

						option.parameters.imageData2 = results[0]?.status === 'fulfilled' ? results[0].value as ImageData : '';
						option.parameters.imageData3 = results[1]?.status === 'fulfilled' ? results[1].value as ImageData : '';

						if(LENTICULAR_CASE.includes(option.name)){

							const tmp    = new Image();
							const img2   = new Image();
							const fab2   = new this.fabric.Canvas();
							const width  = canvas.width * canvas.ratio;
							const height = canvas.height * canvas.ratio;

							img2.onload = () => {

								fab2.setDimensions({width: canvas.width, height: canvas.height});
								fab2.ratio = canvas.ratio;

								image.cloneAsImage((clone) => {

									fab2.add(clone);
									clone.setElement(img2);

									clone.left   = image.left;
									clone.top    = image.top;
									clone.width  = image.width;
									clone.height = image.height;
									clone.scaleX = image.scaleX;
									clone.scaleY = image.scaleY;
									clone.cropX  = image.cropX;
									clone.cropY  = image.cropY;
									clone.ratio  = image.ratio;

									fab2.toDataURL({format: 'png', enableRetinaScaling: false, multiplier: canvas.ratio});

									methods.getimagedata(fab2.toDataURL({format: 'png', enableRetinaScaling: false, multiplier: canvas.ratio}), {width, height}).then((imageData2) => {

										option.parameters.imageData2 = imageData2;

										tmp.onload = () => {

											image.setElement(tmp);

											image.left   = 0;
											image.top    = 0;
											image.width  = tmp.width;
											image.height = tmp.height;
											image.scaleX = tmp.width / canvas.ratio / tmp.width;
											image.scaleY = tmp.height / canvas.ratio / tmp.height;
											image.cropX  = 0;
											image.cropY  = 0;
											image.ratio  = 0;

											image.filters.push(new this.fabric.Image.filters[action.name](option.parameters));

											next();

										};

										tmp.src = canvas.toDataURL({format: 'png', enableRetinaScaling: false, multiplier: canvas.ratio});

									});

								});

							};

							img2.src = methods.getimageurl(option.parameters.imageData2 as ImageData, {width, height});

						}else{

							image.filters.push(new this.fabric.Image.filters[action.name](option.parameters));

							next();

						}

					});

				});

				[...actions]
				.reduce((previous, current, i) => previous.then(() => accumulator(actions[i])), Promise.resolve())
				.then(() => resolve(image));

			}catch(error){

				reject(error);

			}

		});

	}

	apply(image: fabricImage, configuration: filtersConfig): Promise<fabricImage>{ // eslint-disable-line

		return new Promise((resolve, reject) => { // eslint-disable-line

			try{

				Filters.remove(image);

				if(configuration.name && configuration.actions.length){

					const SAVE_TYPE = this.type;
					const AUTO_TYPE = 'auto';
					let   FORCE     = false;

					if(configuration.force !== AUTO_TYPE && configuration.force !== SAVE_TYPE){

						FORCE = true;

						this.type = configuration.force;

					}

					const actions = this.getactions(image, configuration);

					let NEED_GL_FILTERING = this.ios === false;

					if(FORCE && this.type === 'js'){

						NEED_GL_FILTERING = false;

						this.fabric.enableGLFiltering = NEED_GL_FILTERING;
						this.fabric.filterBackend     = this.fabric.initFilterBackend();

					}else if(FORCE && this.type === 'webgl'){

						NEED_GL_FILTERING = true;

						this.fabric.enableGLFiltering = NEED_GL_FILTERING;
						this.fabric.filterBackend     = this.fabric.initFilterBackend();

					}else if(this.fabric.enableGLFiltering !== NEED_GL_FILTERING){

						this.fabric.enableGLFiltering = NEED_GL_FILTERING;
						this.fabric.filterBackend     = this.fabric.initFilterBackend();

					}

					this.action(image, configuration.name, actions).then(() => {

						this.type = SAVE_TYPE;

						resolve(image);

					}).catch((error) => {

						reject(error);

					});

				}else{

					resolve(image);

				}

			}catch(error){

				reject(error);

			}

		});

	}

}
