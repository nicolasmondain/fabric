/* eslint-disable max-lines-per-function, max-lines */

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

const copy = (b64) => {

	b64.select();

	document.execCommand('copy');

};

const download = (canvas, ratio, select, type) => {

	const base64 = canvas.toDataURL({format: 'png', enableRetinaScaling: false, multiplier: ratio});

	window.fetch(base64).then((response) => response.blob()).then((blob) => {

		const a   = document.createElement('a');
		const url = window.URL.createObjectURL(blob);

		a.style    = 'display:none';
		a.href     = url;
		a.download = `${select.value}-${type}.png`;

		document.body.appendChild(a);
		a.click();

		const REMOVE_REVOKE_TIMEOUT = 100;

		setTimeout(() => {

			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);

		}, REMOVE_REVOKE_TIMEOUT);

	});

};

const file = (f, b64) => {

	const reader = new FileReader();

	reader.onload = () => {

		b64.value = reader.result;

	};

	reader.onerror = () => {

		console.log(reader.error);

	};

	reader.readAsDataURL(f.files[0]);

};

const canvas       = {width: 1200, height: 1800};
const shoot        = {width: 1200, height: 1800};
const incrustation = {a: 0, x: 100, y: 100, w: 1000, h: 1000};
const actions      = '[{"name": "treshold", "parameters": {"value1": 150}},{"name": "colorscheme2", "parameters": {"value1": 100}}]';
const timeout      = 500;

const HTMLSelectElementAll  = document.getElementById('select-all');
const HTMLSelectElementType = document.getElementById('select-type');

let onChangeWebGL = null;
let onChangeJS    = null;
let onClickWebGL  = null;
let onClickJS     = null;

const WEBGL_EXTENDED  = new extendedfabric.Fabric(fabricWebGL, 'webgl').extend(); // eslint-disable-line no-undef
const WEBGL_CANVAS    = new WEBGL_EXTENDED.Canvas('canvas-webgl', {backgroundColor: '#eaecef'});
const WEBGL_CONTAINER = document.getElementById('canvas-container-webgl');
const WEBGL_ACTIONS   = document.getElementById('actions-webgl');
const WEBGL_APPLY     = document.getElementById('apply-webgl');
const WEBGL_SELECT    = document.getElementById('select-webgl');
const WEBGL_EXECUTION = document.getElementById('execution-webgl');
const WEBGL_FILE      = document.getElementById('file-webgl');
const WEBGL_COPY      = document.getElementById('copy-webgl');
const WEBGL_B64       = document.getElementById('b64-webgl');
const WEBGL_DOWNLOAD  = document.getElementById('download-webgl');
const WEBGL_RATIO     = canvas.width / WEBGL_CONTAINER.offsetWidth;
const WEBGL_SPINNER   = document.getElementById('spinner-webgl');
const WEBGL_FILTERS   = Object.keys(WEBGL_EXTENDED.extendedfilters.config);
const WEBGL_INCR_OPTS = getincrustationoptions(incrustation, gethomothetic(shoot.width, shoot.height, incrustation.w, incrustation.h), shoot, WEBGL_RATIO);

const JS_EXTENDED     = new extendedfabric.Fabric(fabricJS, 'js').extend(); // eslint-disable-line no-undef
const JS_CANVAS       = new JS_EXTENDED.Canvas('canvas-js', {backgroundColor: '#eaecef'});
const JS_CONTAINER    = document.getElementById('canvas-container-js');
const JS_ACTIONS      = document.getElementById('actions-js');
const JS_APPLY        = document.getElementById('apply-js');
const JS_SELECT       = document.getElementById('select-js');
const JS_EXECUTION    = document.getElementById('execution-js');
const JS_FILE         = document.getElementById('file-js');
const JS_COPY         = document.getElementById('copy-js');
const JS_B64          = document.getElementById('b64-js');
const JS_DOWNLOAD     = document.getElementById('download-js');
const JS_RATIO        = canvas.width / JS_CONTAINER.offsetWidth;
const JS_SPINNER      = document.getElementById('spinner-js');
const JS_FILTERS      = Object.keys(JS_EXTENDED.extendedfilters.config);
const JS_INCR_OPTS    = getincrustationoptions(incrustation, gethomothetic(shoot.width, shoot.height, incrustation.w, incrustation.h), shoot, JS_RATIO);

WEBGL_CANVAS.ratio  = WEBGL_RATIO;
WEBGL_ACTIONS.value = actions;

JS_CANVAS.ratio     = JS_RATIO;
JS_ACTIONS.value    = actions;

WEBGL_CANVAS.setDimensions({width: canvas.width / WEBGL_RATIO, height: canvas.height / WEBGL_RATIO});

JS_CANVAS.setDimensions({width: canvas.width / JS_RATIO, height: canvas.height / JS_RATIO});

for(let i = 0; i < WEBGL_FILTERS.length; i += 1){

	const option = document.createElement('option');

	option.value     = WEBGL_FILTERS[i];
	option.innerHTML = WEBGL_FILTERS[i];

	WEBGL_SELECT.appendChild(option);

}

for(let i = 0; i < JS_FILTERS.length; i += 1){

	const option = document.createElement('option');

	option.value     = JS_FILTERS[i];
	option.innerHTML = JS_FILTERS[i];

	JS_SELECT.appendChild(option);

}

WEBGL_DOWNLOAD.addEventListener('click', () => download(WEBGL_CANVAS, WEBGL_RATIO, WEBGL_SELECT, 'webgl'));
WEBGL_COPY.addEventListener('click', () => copy(WEBGL_B64));
WEBGL_FILE.addEventListener('change', () => file(WEBGL_FILE, WEBGL_B64));

JS_DOWNLOAD.addEventListener('click', () => download(JS_CANVAS, JS_RATIO, JS_SELECT, 'js'));
JS_COPY.addEventListener('click', () => copy(JS_B64));
JS_FILE.addEventListener('change', () => file(JS_FILE, JS_B64));

WEBGL_EXTENDED.Image.fromURL('./img/SHOOT-0.jpg', (image) => {

	onChangeWebGL = () => new Promise((resolve) => {

		WEBGL_SPINNER.classList.remove('d-none');

		window.setTimeout(() => {

			const conf  = WEBGL_EXTENDED.extendedfilters.getconf(WEBGL_SELECT.value, [{index: 1, type: 'SHOOT', src: './img/SHOOT-1.jpg'}], '../src/filters/img/');
			const start = new Date().getTime();

			WEBGL_EXTENDED.extendedfilters.apply(image, conf).then(() => {

				image.applyFilters();
				WEBGL_CANVAS.renderAll();

				const end = new Date().getTime();

				WEBGL_EXECUTION.innerHTML = end - start;

				const confactions = JSON.parse(JSON.stringify(conf.actions));

					confactions.map((a) => { // eslint-disable-line array-callback-return

						delete a.parameters.json;
						delete a.parameters.frame;
						delete a.parameters.homothetic;

					});

					WEBGL_ACTIONS.value = JSON.stringify(confactions, null, 2);

					WEBGL_SPINNER.classList.add('d-none');

					resolve();

			}).catch((error) => {

				console.log(error);

			});

		}, timeout);

	});

	onClickWebGL = () => {

		WEBGL_SPINNER.classList.remove('d-none');

		window.setTimeout(() => {

			let text = WEBGL_ACTIONS.value;

			try{

				text = JSON.parse(text);

			}catch(error){

				text = [];

			}finally{

				const conf  = WEBGL_EXTENDED.extendedfilters.getconf(new Date().getTime().toString(), [{index: 1, type: 'SHOOT', src: './img/SHOOT-1.jpg'}], '../src/filters/img/', text);
				const start = new Date().getTime();

				WEBGL_EXTENDED.extendedfilters.apply(image, conf).then(() => {

					image.applyFilters();
					WEBGL_CANVAS.renderAll();

					const end = new Date().getTime();

					WEBGL_EXECUTION.innerHTML = end - start;

					const confactions = JSON.parse(JSON.stringify(conf.actions));

					confactions.map((a) => { // eslint-disable-line array-callback-return

						delete a.parameters.json;
						delete a.parameters.frame;
						delete a.parameters.homothetic;

					});

					WEBGL_ACTIONS.value = JSON.stringify(confactions, null, 2);

					WEBGL_SPINNER.classList.add('d-none');

				}).catch((error) => {

					console.log(error);

				});

			}

		}, timeout);

	};

	WEBGL_CANVAS.add(image);
	WEBGL_SELECT.addEventListener('change', onChangeWebGL);
	WEBGL_APPLY.addEventListener('click', onClickWebGL);

}, WEBGL_INCR_OPTS);

JS_EXTENDED.Image.fromURL('./img/SHOOT-0.jpg', (image) => {

	onChangeJS = () => new Promise((resolve) => {

		JS_SPINNER.classList.remove('d-none');

		window.setTimeout(() => {

			const conf  = JS_EXTENDED.extendedfilters.getconf(JS_SELECT.value, [{index: 1, type: 'SHOOT', src: './img/SHOOT-1.jpg'}], '../src/filters/img/');
			const start = new Date().getTime();

			JS_EXTENDED.extendedfilters.apply(image, conf).then(() => {

				image.applyFilters();
				JS_CANVAS.renderAll();

				const end = new Date().getTime();

				JS_EXECUTION.innerHTML = end - start;

				const confactions = JSON.parse(JSON.stringify(conf.actions));

					confactions.map((a) => { // eslint-disable-line array-callback-return

						delete a.parameters.json;
						delete a.parameters.frame;
						delete a.parameters.homothetic;

					});

					JS_ACTIONS.value = JSON.stringify(confactions, null, 2);

					JS_SPINNER.classList.add('d-none');

					resolve();

			}).catch((error) => {

				console.log(error);

			});

		}, timeout);

	});

	onClickJS = () => {

		JS_SPINNER.classList.remove('d-none');

		window.setTimeout(() => {

			let text = JS_ACTIONS.value;

			try{

				text = JSON.parse(text);

			}catch(error){

				text = [];

			}finally{

				const conf  = JS_EXTENDED.extendedfilters.getconf(new Date().getTime().toString(), [{index: 1, type: 'SHOOT', src: './img/SHOOT-1.jpg'}], '../src/filters/img/', text);
				const start = new Date().getTime();

				JS_EXTENDED.extendedfilters.apply(image, conf).then(() => {

					image.applyFilters();
					JS_CANVAS.renderAll();

					const end = new Date().getTime();

					JS_EXECUTION.innerHTML = end - start;

					const confactions = JSON.parse(JSON.stringify(conf.actions));

					confactions.map((a) => { // eslint-disable-line array-callback-return

						delete a.parameters.json;
						delete a.parameters.frame;
						delete a.parameters.homothetic;

					});

					JS_ACTIONS.value = JSON.stringify(confactions, null, 2);

					JS_SPINNER.classList.add('d-none');

				}).catch((error) => {

					console.log(error);

				});

			}

		}, timeout);

	};

	JS_CANVAS.add(image);
	JS_SELECT.addEventListener('change', onChangeJS);
	JS_APPLY.addEventListener('click', onClickJS);

}, JS_INCR_OPTS);

const updateSelectAllList = () => {

	while(HTMLSelectElementAll.firstChild){

		HTMLSelectElementAll.removeChild(HTMLSelectElementAll.firstChild);

	}

	for(let i = 0; i < WEBGL_FILTERS.length; i += 1){

		const filter = WEBGL_FILTERS[i];
		const config = WEBGL_EXTENDED.extendedfilters.config[filter];

		if(config.type === HTMLSelectElementType.value){

			const option = document.createElement('option');

			option.value     = WEBGL_FILTERS[i];
			option.innerHTML = config.name;

			WEBGL_SELECT.appendChild(option);

			HTMLSelectElementAll.appendChild(option.cloneNode(true));

		}

	}

};

updateSelectAllList();

HTMLSelectElementType.addEventListener('change', () => updateSelectAllList());

HTMLSelectElementAll.addEventListener('change', async function Change(){

	const changes = [];

	if(WEBGL_SELECT){

		changes.push({select: WEBGL_SELECT, method: onChangeWebGL});

	}

	if(JS_SELECT){

		changes.push({select: JS_SELECT, method: onChangeJS});

	}

	for(const change of changes){

		change.select.value = this.value;

		await change.method(); // eslint-disable-line no-await-in-loop

	}

	if(changes.length){

		const executions = [WEBGL_EXECUTION, JS_EXECUTION];
		const max 			 = Math.max(...executions.filter((e) => e).map((e) => parseInt(e.innerHTML, 10)));
		const min 			 = Math.min(...executions.filter((e) => e).map((e) => parseInt(e.innerHTML, 10)));

		for(let i = 0; i < executions.length; i += 1){

			if(executions[i] && executions[i].innerHTML === min.toString()){

				executions[i].style.color = 'green';

			}else if(executions[i] && executions[i].innerHTML === max.toString()){

				executions[i].style.color = 'red';

			}else if(executions[i]){

				executions[i].style.color = 'black';

			}

		}

	}

});

const available        = document.getElementById('available');
const availableactions = Object.keys(WEBGL_EXTENDED.extendedfilters.extensions).filter((e) => fabricWebGL.Image.filters[e]).map((e) => { // eslint-disable-line no-undef

	return{

		name         : e,
		configuration: fabricWebGL.Image.filters[e].prototype.configuration,										// eslint-disable-line no-undef
		parameters   : Object.keys(fabricWebGL.Image.filters[e].prototype.configuration || {}),	// eslint-disable-line no-undef
		description  : fabricWebGL.Image.filters[e].prototype.description												// eslint-disable-line no-undef

	};

});

for(let i = 0; i < availableactions.length; i += 1){

	const tr          = document.createElement('tr');
	const index       = document.createElement('td');
	const name        = document.createElement('td');
	const parameters  = document.createElement('td');
	const description = document.createElement('td');

	index.innerHTML			  = i + 1;
	name.innerHTML        = `<strong>${availableactions[i].name}</strong>`;
	parameters.innerHTML  = `<ul class="small">${availableactions[i].parameters.map((p) => `<li>${p} <kbd>${availableactions[i].configuration[p]}</kbd></li>`).join().replace(/,/gu, '')}</ul>`;
	description.innerHTML = `<p><em><small>${availableactions[i].description}</small></em></p>`;

	tr.appendChild(index);
	tr.appendChild(name);
	tr.appendChild(parameters);
	tr.appendChild(description);

	available.appendChild(tr);

}
