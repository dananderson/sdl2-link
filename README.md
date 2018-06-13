# sdl2-link

FFI bindings for SDL 2.0.

sdl2-link provides a fluent API that allows for specifying the native call module and the SDL 2.0 
extensions to be loaded. The result of load() is a namespace containing the available functions, constants, 
macros and structs. The naming follows the SDL 2.0 C API as closely as possible.

* Supports FFI-compatible native call libraries, including fastcall and ffi.
* Supports SDL 2.0 extensions:
    * SDL2_image
    * SDL2_mixer
    * SDL2_ttf

## Requirements

* The SDL 2.0 library must be available through the system's library path.
* Supply an FFI-compatible native call libraries via dependency injection.
    * [fastcall](https://www.npmjs.com/package/fastcall) (Recommended)
    * [ffi-napi](https://www.npmjs.com/package/ffi-napi) + [ref-napi](https://www.npmjs.com/package/ref-napi)
    * [ffi](https://www.npmjs.com/package/ffi) + [ref](https://www.npmjs.com/package/ref) 

## Installation

```
npm install sdl2-link     
```

## Getting Started

### SDL 2.0 API

```javascript
import sdl2link from 'sdl2-link';

const SDL = sdl2link()
    .withFastcall(require('fastcall'))
    .load();

SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

```

### SDL 2.0 Extensions

```javascript
import sdl2link from 'sdl2-link';

const SDL = sdl2link()
    .withFastcall(require('fastcall'))
    .withTTF()
    .load();

SDL.TTF_Init();
SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

```

## Caveats

Some of the Joystick and GameController APIs are not compatible with fastcall. All these APIs have been separated out 
into a separate extension that can only be loaded with ffi. If you are using fastcall, you can safely use ffi to load
the joystick extension.

## SDL 2.0 Documentation

The namespace (object) sdl2-link returns contains constants, structs and functions exactly as they appear in the SDL 2.0 API. Use the official SDL 2.0 documentation for reference.

* [SDL2](https://wiki.libsdl.org/CategoryAPI)
* [SDL2_ttf](https://www.libsdl.org/projects/SDL_ttf/docs/SDL_ttf.html)
* [SDL2_image](https://www.libsdl.org/projects/SDL_image/docs/SDL_image.html)
* [SDL2_mixer](https://www.libsdl.org/projects/SDL_mixer/docs/index.html)

 