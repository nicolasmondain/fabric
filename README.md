# fabric

Extension of frabric.js, including additional filters and methods dedicated to image processing.

![Version](https://img.shields.io/github/package-json/version/nicolasmondain/fabric)
![Downloads](https://img.shields.io/npm/dm/@nicolasmondain/fabric.svg)
![Contributors](https://img.shields.io/github/contributors/nicolasmondain/fabric)
![Issues](https://img.shields.io/github/issues/nicolasmondain/fabric)
![License](https://img.shields.io/github/license/nicolasmondain/fabric)

## Installation

```bash
npm install @nicolasmondain/fabric@latest --save
```
## Usage

`@nicolasmondain/fabric` is an extension of `fabric.js`.
To use it, we need to import `fabric` into it, then return its instance after it has been _extended_.

extend.js

```javascript

import {fabric} from 'fabric'; // fabric@5.2.1
import {Fabric} from '@nicolasmondain/fabric';

const extended = new Fabric(fabric).extend();

export default extended;
```
We can then use `fabric` in the standard way by importing the _extended_ object as follows:

```javascript
import fabric from './extend.js';

const FILTER_NAME       = 'beautyfilter';
const FILTER_FILES      = [];
const FILTER_FILES_PATH = '../assets/filters/img/';
const FILTER_ACTIONS    = [];

const canvas = new fabric.Canvas('canvas');
const url    = './img/SHOOT-0.jpg';
const conf   = fabric.extendedfilters.getconf(FILTER_NAME, FILTER_FILES, FILTER_FILES_PATH, FILTER_ACTIONS);

fabric.Image.fromURL(url, (image) => {

	fabric.extendedfilters.apply(image, conf).then(() => {

		image.applyFilters();
		canvas.add(image);

	});

}, {crossOrigin: 'anonymous'});

```
### Create a filter

A filter is a sequence of actions.
It is possible to add a filter (name, test, actions) in the `src/filters/config.ts` file.

```js
arianablack: {
	name   : 'arianablack',
	test   : false,
	actions: [

		{name: 'multiply', parameters: {imageData2: 'arianablack.png'}},
		{name: 'colorscheme2', parameters: {value1: 100}},
		{name: 'saturation', parameters: {value1: 20}}

	]
}
```
### Test

To test the filters (and the actions that compose them), it is necessary to launch the test page `test/index.test.html` in a server (under __vscode__, right click: _open with Live Server_ if the extension _LiveServer_ is installed).

- https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

If changes have been applied, run the following command line:

```bash
npm run webpack:development
```

>## Notes
>
> ### WebGl
>
> __Attention__ :
>
> Les _actions_ peuvent également être modifiées.
> Chaque action correspond à un fichier dans `src/filters/extend/`. Dans chaque fichier, le > _shader_ `webGL` peut être modifié dans `fragmentSource`.
>
>
> le code `webGL` et `JavaScript` doivent correspondre.
>
> Aussi, il faut toujours veiller à ce que les traitements appliqués sur l'image dans le _shader_ `webGL` correspondent aux traitements `JavaScript` (dans `applyTo2d`). Les traitements `webGL` sont utilisés sous _Windows_. `JavaScript` sont utilisés sous _iPhone_ et _iPad_ (qui ne peuvent pas générer autant de contextes `webGL` que nécessaire).
>
> Erreur générée sous _iPhone_ et _iPad_
>
> ```bash
> There are too many active WebGL contexts on this page, the oldest context will be lost.
>
> TypeError
> Argument 1 ('shader') to WebGLRenderingContext.shaderSource must be an instance of WebGLShader
> shaderSource@[native code]
> ```
> - https://webglfundamentals.org/webgl/lessons/fr/webgl-how-it-works.html
> - https://webglfundamentals.org/webgl/lessons/fr/webgl-shaders-and-glsl.html
>
> ### WebAssembly
>
> Une fois le projet téléchargé, depuis la racine (au niveau de package.json), télécharger et installer `EMscripten` (qui permettra de compiler le code `C/C++` en `WebAssembly`) si nécessaire :
>
> - https://developer.mozilla.org/fr/docs/WebAssembly/C_to_wasm
> - https://emscripten.org/docs/getting_started/downloads.html
> - https://emscripten.org/docs/tools_reference/emcc.html
>
> ```bash
>
> git clone https://github.com/emscripten-core/emsdk.git
>
> # Enter that directory
> cd emsdk
>
> # Fetch the latest version of the emsdk (not needed the first time you clone)
> git pull
>
> # Download and install the latest SDK tools.
> ./emsdk install latest
>
> # Make the "latest" SDK "active" for the current user. (writes .emscripten file)
> ./emsdk activate latest
>
> # Activate PATH and other environment variables in the current terminal
> source ./emsdk_env.sh
> ```
>
> _On Windows, run emsdk instead of ./emsdk, and emsdk_env.bat instead of source ./emsdk_env.sh._
>
> ### Build
>
>
> Si une première installation adéjà été effectuée, au prochain lancement, simplement activer `emsdk` avant de lancer à nouveau les lignes de commandes par fichier.
>
> ```bash
> emsdk activate latest
> ```
>
> ```bash
> emcc -o ../src/filters/extend/webassembly_.js ../src/filters/extend/webassembly_.c -s EXPORTED_RUNTIME_METHODS=ccall,cwrap -s EXPORTED_FUNCTIONS=_malloc,_free -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s ALLOW_MEMORY_GROWTH=1 -s TOTAL_MEMORY=512mb
> ```
>
