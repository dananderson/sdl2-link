# sdl2-link

Node bindings for SDL 2.0, SDL_image, SDL_mixer and SDL_ttf.

## Installation

```
npm install sdl2-link
```

## Usage

Load SDL.

```javascript
// Load the SDL library, including constants, structs, unions and functions.
const SDL = require('sdl2-link')()

// Start making calls to SDL2.
SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

```

Load SDL with extensions. SDL_ttf, SDL_image and SDL_mixer are supported extensions.

```javascript
// Load the SDL library with the SDL_ttf extension.
const SDL = require('sdl2-link')({ extensions: [ 'SDL_ttf' ] });

// Start making calls to SDL.
SDL.TTF_Init();
SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

```

## SDL2 Documentation

The namespace (object) sdl2-link returns contains constants, structs and functions exactly as they appear in the SDL2 API. Use the official SDL2 documentation for reference.

- [SDL2](https://wiki.libsdl.org/CategoryAPI)
- [SDL2_ttf](https://www.libsdl.org/projects/SDL_ttf/docs/SDL_ttf.html)
- [SDL2_image](https://www.libsdl.org/projects/SDL_image/docs/SDL_image.html)
- [SDL2_mixer](https://www.libsdl.org/projects/SDL_mixer/docs/index.html)

## Notes

- [fastcall](https://www.npmjs.com/package/fastcall) has a compatible FFI API, but it does not currently support some SDL function signatures (structs by value).

 