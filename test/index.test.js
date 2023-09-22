import 'jsdom-global/register';
import 'mocha';
import * as chai from 'chai';

import {fabric} from 'fabric';
import {Fabric} from '../dist/main';

chai.should();

describe('fabric (js)', () => {

	context('check extended', () => {

		const extended = new Fabric(fabric).extend();

		it('extended should be an object', () => {

			chai.expect(extended).to.be.an('object');

		});

		it('extended should have extended filters', () => {

			chai.expect(extended.Image.filters.darken).to.be.a('function');

		});

		it('extended should disable GLFiltering', () => {

			chai.expect(extended.enableGLFiltering).to.equal(false);

		});

	});

});
