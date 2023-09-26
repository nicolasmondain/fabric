---
layout: post
title:  "How to use WebAssembly?"
date:   2023-09-26 11:14:45 +0200
categories: contributing
---

It is possible to use `C/C++` to process images.
Example with the `webassembly.ts` filter:

* webassembly_.c
* webassembly_.js
* webassembly_.ts
* webassembly_.wasm
* webassembly.ts

Once the project has been downloaded, from the root (at the package.json level), download and install `EMscripten` (which will compile the `C/C++` code into `WebAssembly`) if necessary:

* [https://developer.mozilla.org/fr/docs/WebAssembly/C_to_wasm](https://developer.mozilla.org/fr/docs/WebAssembly/C_to_wasm)
* [https://emscripten.org/docs/getting_started/downloads.html](https://emscripten.org/docs/getting_started/downloads.html)
* [https://emscripten.org/docs/tools_reference/emcc.html](https://emscripten.org/docs/tools_reference/emcc.html)

```bash

git clone https://github.com/emscripten-core/emsdk.git

# Enter that directory
cd emsdk

# Fetch the latest version of the emsdk (not needed the first time you clone)
git pull

# Download and install the latest SDK tools.
./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh
```

_On Windows, run emsdk instead of ./emsdk, and emsdk_env.bat instead of source ./emsdk_env.sh._

## Build

If a first installation has already been done, at the next launch, simply activate `emsdk` before launching the command lines again.

```bash
emsdk activate latest
```

```bash
emcc -o ../src/filters/extend/webassembly_.js ../src/filters/extend/webassembly_.c -s EXPORTED_RUNTIME_METHODS=ccall,cwrap -s EXPORTED_FUNCTIONS=_malloc,_free -s EXPORT_ES6=1 -s MODULARIZE=1 -s USE_ES6_IMPORT_META=0 -s ALLOW_MEMORY_GROWTH=1 -s TOTAL_MEMORY=512mb
```
