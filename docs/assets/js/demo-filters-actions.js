document.addEventListener('DOMContentLoaded', () => {

	const HTMLCanvasElement = document.querySelector('canvas');
	const HTMLSelectElement = document.querySelector('select');
	const HTMLPreElement    = document.querySelector('pre');

	if(HTMLCanvasElement){

		const canvas       = {width: 1200, height: 1800};
		const shoot        = {width: 1200, height: 1800};
		const incrustation = {a: 0, x: 100, y: 100, w: 1000, h: 1000};
		const ratio        = canvas.width / HTMLCanvasElement.offsetWidth;

		const FABRIC   = new fabricExtend.Fabric(fabric, 'webgl').extend(); // eslint-disable-line no-undef
		const CANVAS   = new FABRIC.Canvas(HTMLCanvasElement, {backgroundColor: '#eaecef'});
		const CONFIG   = Object.keys(FABRIC.extended.filters.config);
		const STANDARD = CONFIG.filter((c) => FABRIC.extended.filters.config[c].type === 'action').sort();
		const POSITION = FABRIC.extended.methods.position.get('incrustation', incrustation, {

			i    : incrustation,
			h    : FABRIC.extended.methods.homothetic.gethomothetic(shoot.width, shoot.height, incrustation.w, incrustation.h),
			f    : shoot,
			r    : ratio,
			merge: {flipX: false, flipY: false, backgroundColor: '#6c757d'}

		});

		CANVAS.setDimensions({width: canvas.width / ratio, height: canvas.height / ratio});

		for(let i = 0; i < STANDARD.length; i += 1){

			const option = document.createElement('option');

			option.value     = STANDARD[i];
			option.innerHTML = STANDARD[i];

			HTMLSelectElement.appendChild(option);

		}

		FABRIC.Image.fromURL('https://raw.githubusercontent.com/nicolasmondain/fabric/master/docs/assets/img/SHOOT-0.jpg', (image) => {

			CANVAS.add(image);
			CANVAS.renderAll();

			HTMLSelectElement.addEventListener('change', () => {

				const name    = HTMLSelectElement.value;
				const actions = [];
				const prefix  = '../../assets/img/';
				const medias  = [];

				const conf = FABRIC.extended.filters.getconf(name, actions, prefix, medias);

				FABRIC.extended.filters.apply(image, conf).then(() => {

					image.applyFilters();
					CANVAS.renderAll();

					HTMLPreElement.innerHTML = JSON.stringify(FABRIC.extended.filters.config[HTMLSelectElement.value], null, 2);

				}).catch((error) => {

					console.log(error);

				});

			});

		}, POSITION);

	}

});

// incrustation, FABRIC.extended.methods.homothetic.gethomothetic(shoot.width, shoot.height, incrustation.w, incrustation.h), shoot, ratio)

// type: string, opts: {i: incrustation, h: homothetic, f: frame, r: number, merge?: Record<string, any>}

// backgroundColor : '#6c757d',
// 		flipX,
// 		flipY
