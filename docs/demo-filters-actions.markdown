---
layout: default
title: Actions
permalink: /demo/filters/actions
nav_order: 0
nav_exclude: false
parent: Filters
grand_parent: Demo
css:
  - https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css
js:
  # - https://raw.githack.com/nicolasmondain/fabric/master/dist/main.js
  - https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js
  - ../../assets/js/main.js
  - ../../assets/js/demo-filters-actions.js
---

<h1>Actions</h1>
<select id="actions" width="100%"></select>
<input type="number" min="-100" max="100" id="value1" width="100%" style="display:none"/>
<input type="number" min="-100" max="100" id="value2" width="100%" style="display:none"/>
<input type="file" accept="image/png;image/jpeg" id="file1" width="100%" style="display:none"/>
<input type="file" accept="image/png;image/jpeg" id="file2" width="100%" style="display:none"/>
<button class="btn" id="upload2" style="display:none">imageData2</button>
<h2 id="name" style="margin-top:0px;"></h2>
<p id="description" class="fs-2"></p>
<pre class="code-example fs-1" id="pre"></pre>
<p class="fs-2">Many actions require a second image (<code>imageData2</code>). Please upload an image before applying your filter. You can find many free downloadable images at: <a href="https://unsplash.com/fr/t/architecture-interior" target="_blank">https://unsplash.com/</a></p>
<button class="btn btn-purple" id="apply">apply</button>
<canvas width="500px;" height="1000px;" id="canvas"></canvas>
<p class="fs-2">Update the initial image added to the canvas. You can find many free downloadable images at: <a href="https://unsplash.com/fr/t/people" target="_blank">https://unsplash.com/</a></p>
<button class="btn" id="upload1">imageData1</button>
<button class="btn btn-purple" id="download">download</button>

