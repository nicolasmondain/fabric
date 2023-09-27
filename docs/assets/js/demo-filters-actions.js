/* eslint-disable max-lines-per-function */

document.addEventListener('DOMContentLoaded', () => {

	const HTMLCanvasElement      = document.getElementById('canvas');
	const HTMLSelectElement      = document.getElementById('actions');
	const HTMLDownloadElement    = document.getElementById('download');
	const HTMLApplyElement       = document.getElementById('apply');
	const HTMLInputFileElement   = document.getElementById('file');
	const HTMLUploadElement      = document.getElementById('upload');
	const HTMLInputValue1Element = document.getElementById('value1');
	const HTMLInputValue2Element = document.getElementById('value2');
	const HTMLNameElement        = document.getElementById('name');
	const HTMLDescElement        = document.getElementById('description');
	const HTMLPreElement         = document.getElementById('pre');

	const canvas       = {width: 1200, height: 1800};
	const shoot        = {width: 1200, height: 1800};
	const incrustation = {a: 0, x: 100, y: 100, w: 1000, h: 1000};
	const ratio        = canvas.width / HTMLCanvasElement.offsetWidth;

	const FABRIC   = new fabricExtend.Fabric(fabric).extend(); // eslint-disable-line no-undef
	const CANVAS   = new FABRIC.Canvas(HTMLCanvasElement, {backgroundColor: '#eaecef'});
	const CONFIG   = Object.keys(FABRIC.extended.filters.config);
	const STANDARD = CONFIG.filter((c) => FABRIC.extended.filters.config[c].type === 'action').sort();
	const POSITION = FABRIC.extended.methods.position.get('incrustation', {

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

		const checkInputs = () => {

			if(Object.prototype.hasOwnProperty.call(FABRIC.Image.filters[HTMLSelectElement.value].prototype.configuration, 'imageData2') && !HTMLInputFileElement.files.length){

				HTMLApplyElement.disabled = true;

			}else{

				HTMLApplyElement.disabled = false;

			}

		};

		const apply = () => {

			HTMLApplyElement.disabled = true;

			const name    = HTMLSelectElement.value;
			const actions = [];
			const prefix  = '../../assets/img/';
			const medias  = [];

			const conf = FABRIC.extended.filters.getconf(name, actions, prefix, medias);

			FABRIC.extended.filters.apply(image, conf).then(() => {

				image.applyFilters();
				CANVAS.renderAll();

				HTMLInputValue1Element.value = FABRIC.extended.filters.config[HTMLSelectElement.value].actions[0].parameters.value1 || 0;
				HTMLInputValue2Element.value = FABRIC.extended.filters.config[HTMLSelectElement.value].actions[0].parameters.value2 || 0;
				HTMLPreElement.innerHTML     = JSON.stringify(FABRIC.extended.filters.config[HTMLSelectElement.value].actions, null, 2);
				HTMLNameElement.innerHTML		 = HTMLSelectElement.value;
				HTMLDescElement.innerHTML		 = FABRIC.Image.filters[HTMLSelectElement.value].prototype.description || 'no description';

				HTMLApplyElement.disabled = false;

				checkInputs();

			}).catch((error) => console.log(error));

		};

		const updateInputs = () => {

			HTMLInputValue1Element.style.display = 'none';
			HTMLInputValue2Element.style.display = 'none';
			HTMLUploadElement.style.display      = 'none';

			if(Object.prototype.hasOwnProperty.call(FABRIC.Image.filters[HTMLSelectElement.value].prototype.configuration, 'value1')){

				HTMLInputValue1Element.style.display = 'block';

			}

			if(Object.prototype.hasOwnProperty.call(FABRIC.Image.filters[HTMLSelectElement.value].prototype.configuration, 'value2')){

				HTMLInputValue2Element.style.display = 'block';

			}

			if(Object.prototype.hasOwnProperty.call(FABRIC.Image.filters[HTMLSelectElement.value].prototype.configuration, 'imageData2')){

				HTMLUploadElement.style.display = 'block';

			}

			HTMLInputValue1Element.value = FABRIC.extended.filters.config[HTMLSelectElement.value].actions[0].parameters.value1 || 0;
			HTMLInputValue2Element.value = FABRIC.extended.filters.config[HTMLSelectElement.value].actions[0].parameters.value2 || 0;

			checkInputs();

		};

		HTMLApplyElement.addEventListener('click', apply);

		HTMLSelectElement.addEventListener('change', updateInputs);

		HTMLInputValue1Element.addEventListener('change', () => {

			FABRIC.extended.filters.config[HTMLSelectElement.value].actions[0].parameters.value1 = HTMLInputValue1Element.value;

		});

		HTMLInputValue2Element.addEventListener('change', () => {

			FABRIC.extended.filters.config[HTMLSelectElement.value].actions[0].parameters.value2 = HTMLInputValue2Element.value;

		});

		HTMLInputFileElement.addEventListener('change', () => {

			const reader = new FileReader();

			reader.onload = () => {

				for(let i = 0; i < STANDARD.length; i += 1){

					const {actions} = FABRIC.extended.filters.config[STANDARD[i]];

					if(Object.prototype.hasOwnProperty.call(actions[0].parameters, 'imageData2')){

						actions[0].parameters.imageData2 = reader.result;

					}

					if(Object.prototype.hasOwnProperty.call(actions[0].parameters, 'imageData3')){

						actions[0].parameters.imageData3 = reader.result;

					}

				}

			};

			reader.onerror = () => console.log(reader.error);

			reader.readAsDataURL(HTMLInputFileElement.files[0]);

			checkInputs();

		});

		HTMLDownloadElement.addEventListener('click', () => {

			const base64 = CANVAS.toDataURL({format: 'png', enableRetinaScaling: false, multiplier: ratio});

			window.fetch(base64).then((response) => response.blob()).then((blob) => {

				const a   = document.createElement('a');
				const url = window.URL.createObjectURL(blob);

				a.style    = 'display:none';
				a.href     = url;
				a.download = `${HTMLSelectElement.value}.png`;

				document.body.appendChild(a);
				a.click();

				const REMOVE_REVOKE_TIMEOUT = 100;

				setTimeout(() => {

					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);

				}, REMOVE_REVOKE_TIMEOUT);

			});

		});

		HTMLUploadElement.addEventListener('click', () => {

			HTMLInputFileElement.click();

		});

		apply();
		updateInputs();

	}, POSITION);

});
