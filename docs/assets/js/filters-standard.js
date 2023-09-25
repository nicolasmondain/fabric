document.addEventListener('load', () => {

	const HTMLCanvasElement = document.querySelector('canvas');

	if(HTMLCanvasElement){

		const canvas       = {width: 1200, height: 1800};
		const shoot        = {width: 1200, height: 1800};
		const incrustation = {a: 0, x: 100, y: 100, w: 1000, h: 1000};
		const ratio        = canvas.width / HTMLCanvasElement.offsetWidth;

		const FABRIC = new extendedfabric.Fabric(fabric, 'webgl').extend(); // eslint-disable-line no-undef
		const CANVAS = new FABRIC.Canvas(HTMLCanvasElement, {backgroundColor: '#eaecef'});

		CANVAS.setDimensions({width: canvas.width / ratio, height: canvas.height / ratio});

	}

});
