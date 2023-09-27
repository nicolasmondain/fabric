import {filtersConfigModule, filtersType, library} from './@types/index';

import {Filters} from './filters/index';

export class Fabric {

	fabric : library;
	filters: Filters;

	constructor(fabric: library, config: filtersConfigModule, ftype: filtersType = 'webgl'){

		this.fabric  = fabric;
		this.filters = new Filters(fabric, config, ftype);

	}

	extend(): library{

		this.filters.extend();

		this.fabric.extendedfilters = this.filters;

		return this.fabric;

	}

}
