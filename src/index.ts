import {filtersConfigModule, filtersType, library} from './@types/index';

import {Filters} from './filters/index';
import homothetic from './methods/homothetic';
import position from './methods/position';

export class Fabric {

	fabric : library;
	filters: Filters;
	methods: Record<string, unknown>;

	constructor(fabric: library, config: filtersConfigModule, ftype: filtersType = 'webgl'){

		this.fabric  = fabric;
		this.filters = new Filters(fabric, config, ftype);
		this.methods = {homothetic, position};

	}

	extend(): library{

		this.filters.extend();

		this.fabric.extended = {

			filters: this.filters,
			methods: this.methods

		};

		return this.fabric;

	}

}
