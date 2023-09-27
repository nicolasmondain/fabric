---
layout: default
title: Installation
permalink: /doc/install
nav_order: 0
nav_exclude: false
parent: Documentation
---

# Installation

```bash
npm install @nicolasmondain/fabric@latest --save
```
## Supported Versions

| Version `fabric.js` | Version `fabric.extend` | Supported |
| ------------------- | ----------------------- | --------- |
| 5.2.1               | 3.0.1                   | ✅        |
| 5.2.3               | 3.0.1                   | ✅        |
| 5.2.4               | 3.0.1                   | ✅        |
| 5.3.1               | 3.0.1                   | ✅        |
| 6.0.x               | 3.0.1                   | ❌        |

## Usage

`fabric.extend` is an extension of `fabric.js`.
To use it, we need to pass `fabric.js` as a parameter, then return its instance (after it has been _extended_).

```javascript
// extend.js

import {fabric} from 'fabric';
import {Fabric} from '@nicolasmondain/fabric';

const extended = new Fabric(fabric).extend();

export default extended;
```
We can then use `fabric.js` in the standard way by importing the _extended_ object as follows:

```javascript
// index.js

import fabric from './extend.js';

const FILTER_NAME       = 'blackandwhite';
const FILTER_FILES      = [];
const FILTER_FILES_PATH = '';
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
By using the script tag:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js" integrity="sha512-CeIsOAsgJnmevfCi2C7Zsyy6bQKi43utIjdA87Q0ZY84oDqnI0uwfM9+bKiIkI75lUeI00WG/+uJzOmuHlesMA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="../node_modules/@nicolasmondain/fabric/dist/main.js"></script>
<script>

	const Fabric = new fabricExtend.Fabric(fabric, 'webgl').extend();

</script>
```
