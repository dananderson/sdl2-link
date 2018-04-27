# sdl2-link

A node module that exposes the SDL2 C API to Javascript through the Foreign Function Interface (FFI).

## Installation

```
npm install sdl2-link
```

## Usage

Load SDL2.

```javascript
// Import FFI modules.
const ref = require('ref-napi');
const ffi = require('ffi-napi');

// Load the SDL2 library, including constants, structs, unions and functions.
const SDL2 = require('sdl2-link')({ ffi: ffi, ref: ref })

// Start making calls to SDL2.
SDL2.SDL_Init(SDL2.SDL_INIT_VIDEO);

```

Load SDL2 with extensions. SDL_ttf, SDL_image and SDL_mixer are supported extensions.

```javascript
// Import FFI modules.
const ref = require('ref-napi');
const ffi = require('ffi-napi');

// Load the SDL2 library with the SDL_ttf extension.
const SDL2 = require('sdl2-link')({ ffi: ffi, ref: ref, extensions: [ 'SDL_ttf' ] });

// Start making calls to SDL2.
SDL2.TTF_Init();
SDL2.SDL_Init(SDL2.SDL_INIT_VIDEO);

```

## SDL2 Documentation

The namespace (object) sdl2-link returns contains constants, structs and functions exactly as they appear in the SDL2 API. Use the official SDL2 documentation for reference.

- [SDL2](https://wiki.libsdl.org/CategoryAPI)
- [SDL2_ttf](https://www.libsdl.org/projects/SDL_ttf/docs/SDL_ttf.html)
- [SDL2_image](https://www.libsdl.org/projects/SDL_image/docs/SDL_image.html)
- [SDL2_mixer](https://www.libsdl.org/projects/SDL_mixer/docs/index.html)

## Notes

- [fastcall](https://www.npmjs.com/package/fastcall) has a compatible FFI API, but it does not currently support some SDL function signatures (structs by value).

 