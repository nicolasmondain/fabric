---
layout: default
title: Position
permalink: /demo/position/
nav_order: 0
nav_exclude: false
parent: Demo
---

# Position (of `fabric.js` elements)

## Initialization

Assign the CanvasHTMLElement:

```javascript
const HTMLCanvasElement = document.getElementById('canvas');
```

Define the size of your final output:

```javascript
const CANVAS_SIZE = {width: 1200, height: 1800};
```

Register the associated ratio (between what you want and what is displayed on the screen):

```javascript
const RATIO = CANVAS_SIZE.width / HTMLCanvasElement.offsetWidth;
```

## Image

Register the size of your image (the one that you will add to your canvas). Please note that if the image dimension is unknown, you will need to add the image to the canvas after obtaining it (onload method).

```javascript
const FRAME = {width: 1200, height: 1800};
```
Define the position of your image (incrustation). `INCRUSTATION` is an object with the following properties:
* `a`: angle
* `x`: x position
* `y`: y position
* `w`: width
* `h`: height

```javascript
const INCRUSTATION = {a: 0, x: 100, y: 100, w: 1000, h: 1000};
```

## Add


```javascript
// extend.js

import {fabric} from 'fabric';
import {Fabric} from '@nicolasmondain/fabric';

const extended = new Fabric(fabric).extend();

export default extended;
```
```javascript
// index.js

import fabric from './extend.js';

const canvas = new fabric.StaticCanvas('canvas');

canvas.ratio = RATIO; // attach ratio to the canvas `fabric.js` object

const position = fabric.extended.methods.position.get('incrustation', {

		i    : INCRUSTATION,
		h    : FABRIC.extended.methods.homothetic.gethomothetic(shoot.width, shoot.height, INCRUSTATION.w, INCRUSTATION.h),
		f    : FRAME,
		r    : RATIO,
		merge: {flipX: false, flipY: false, backgroundColor: '#6c757d'} // additional properties

	});

	FABRIC.Image.fromURL('https://raw.githubusercontent.com/nicolasmondain/fabric/master/docs/assets/img/SHOOT-0.jpg', (image) => {

		canvas.add(image);
		canvas.renderAll();

	}, position);


```
