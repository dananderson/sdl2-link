# sdl2-link

A node module that exposes the SDL2 C API to Javascript through the Foreign Function Interface (FFI).

## Requirements

SDL2 must be installed on your Linux, Mac and Windows system.

Foreign Function Interface (FFI) modules:

https://www.npmjs.com/package/ref-napi
https://www.npmjs.com/package/ffi-napi

or

https://www.npmjs.com/package/ffi
https://www.npmjs.com/package/ref

## Installation

```
npm install sdl2-link
```

## Usage

```javascript
// Import the FFI modules.
const ref = require('ref-napi');
const ffi = require('ffi-napi');
// Load the SDL2 library, including constants, structs, unions and functions.
const SDL2 = require('sdl2-link')({ ffi_package: { ffi: ffi, ref: ref }, libs: [ 'SDL2', 'SDL2_image', 'SDL2_ttf' ] })

// Start making calls to SDL.
SDL2.SDL_Init(SDL2.SDL_INIT_VIDEO);

// etc
```

## Status

The module is currently in an unstable, experimental state.

 