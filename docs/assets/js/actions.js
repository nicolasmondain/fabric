const gethomothetic = (imgw, imgh, incw, inch) => {

	const h = {};

	if(imgw / imgh > incw / inch){

		const newimgw = incw * imgh / inch;

		h.x = (imgw - newimgw) / 2.0;
		h.y = 0;
		h.w = newimgw;
		h.h = imgh;
		h.r = incw / imgw;

	}else if(imgw / imgh < incw / inch){

		const newimgh = imgw * inch / incw;

		h.x = 0;
		h.y = (imgh - newimgh) / 2.0;
		h.w = imgw;
		h.h = newimgh;
		h.r = incw / imgw;

	}else{

		h.x = 0;
		h.y = 0;
		h.w = imgw;
		h.h = imgh;
		h.r = incw / imgw;

	}

	return h;

};

const getincrustationoptions = (incrustation, homothetic, shoot, ratio, flipX = false, flipY = false) => {

	const options = {

		backgroundColor : '#6c757d',
		crossOrigin     : 'Anonymous',
		angle           : incrustation.a,
		left            : incrustation.x / ratio,
		top             : incrustation.y / ratio,
		width           : homothetic.w,
		height          : homothetic.h,
		scaleX          : shoot.width * ((incrustation.w / ratio) / homothetic.w) / shoot.width,
		scaleY          : shoot.height * ((incrustation.h / ratio) / homothetic.h) / shoot.height,
		cropX           : homothetic.x,
		cropY           : homothetic.y,
		type            : 'incrustation',
		selectable      : false,
		centeredRotation: true,
		incrustation,
		homothetic,
		ratio,
		flipX,
		flipY

	};

	return options;

};

document.addEventListener('DOMContentLoaded', () => {

	const HTMLCanvasElement = document.querySelector('canvas');
	const HTMLSelectElement = document.querySelector('select');
	const HTMLPreElement    = document.querySelector('pre');

	if(HTMLCanvasElement){

		const canvas       = {width: 1200, height: 1800};
		const shoot        = {width: 1200, height: 1800};
		const incrustation = {a: 0, x: 100, y: 100, w: 1000, h: 1000};
		const ratio        = canvas.width / HTMLCanvasElement.offsetWidth;

		const FABRIC  = new extendedfabric.Fabric(fabric, 'webgl').extend(); // eslint-disable-line no-undef
		const CANVAS  = new FABRIC.Canvas(HTMLCanvasElement, {backgroundColor: '#eaecef'});
		const CONFIG  = Object.keys(FABRIC.extendedfilters.config);
		const ACTIONS = CONFIG.filter((c) => FABRIC.extendedfilters.config[c].type === 'action').sort();

		console.log(FABRIC.extendedfilters);

		CANVAS.setDimensions({width: canvas.width / ratio, height: canvas.height / ratio});

		for(let i = 0; i < ACTIONS.length; i += 1){

			const option = document.createElement('option');

			option.value     = ACTIONS[i];
			option.innerHTML = ACTIONS[i];

			HTMLSelectElement.appendChild(option);

		}

		FABRIC.Image.fromURL('https://raw.githubusercontent.com/nicolasmondain/fabric/master/docs/assets/img/SHOOT-0.jpg', (image) => {

			CANVAS.add(image);
			CANVAS.renderAll();

			HTMLSelectElement.addEventListener('change', () => {

				const conf = FABRIC.extendedfilters.getconf(HTMLSelectElement.value, [], '../../assets/img/');

				FABRIC.extendedfilters.apply(image, conf).then(() => {

					image.applyFilters();
					CANVAS.renderAll();

					HTMLPreElement.innerHTML = JSON.stringify(FABRIC.extendedfilters.config[HTMLSelectElement.value], null, 2);

				}).catch((error) => {

					console.log(error);

				});

			});

		}, getincrustationoptions(incrustation, gethomothetic(shoot.width, shoot.height, incrustation.w, incrustation.h), shoot, ratio));

	}

});
