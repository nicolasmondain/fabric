---
layout: default
title: Installation
permalink: /doc/install
nav_order: 1
nav_exclude: false
parent: Documentation
---

# Installation

```bash
npm install @nicolasmondain/fabric@latest --save
```
## Supported Versions

Check compatibility between versions of `fabric.js` and `@nicolasmondain/fabric`

| Version `fabric.js` | Version `@nicolasmondain/fabric` | Supported          |
| ------------------- | -------------------------------- | ------------------ |
| 5.2.1               | 3.0.1                            | :white_check_mark: |
| 5.2.3               | 3.0.1                            | :grey_question:    |
| 5.2.4               | 3.0.1                            | :grey_question:    |
| 5.3.1               | 3.0.1                            | :grey_question:    |
| 6.0.x               | 3.0.1                            | :x:                |

## Usage

`@nicolasmondain/fabric` is an extension of `fabric.js`.
To use it, we need to import `fabric` into it, then return its instance after it has been _extended_.

extend.js

```javascript

import {fabric} from 'fabric';
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
