# sdl2-link

Node bindings for SDL 2.0, SDL2_image, SDL2_mixer and SDL2_ttf.

## Installation

```
npm install sdl2-link
```

## Usage

### SDL2 API

```javascript
import sdl2link from 'sdl2-link';

const SDL = sdl2link()
    .withFastcall(require('fastcall'))
    .load();

SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

```

### SDL2 Extensions

```javascript
import sdl2link from 'sdl2-link';

const SDL = sdl2link()
    .withFastcall(require('fastcall'))
    .withTTF()
    .load();

SDL.TTF_Init();
SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

```

## SDL2 Documentation

The namespace (object) sdl2-link returns contains constants, structs and functions exactly as they appear in the SDL2 API. Use the official SDL2 documentation for reference.

- [SDL2](https://wiki.libsdl.org/CategoryAPI)
- [SDL2_ttf](https://www.libsdl.org/projects/SDL_ttf/docs/SDL_ttf.html)
- [SDL2_image](https://www.libsdl.org/projects/SDL_image/docs/SDL_image.html)
- [SDL2_mixer](https://www.libsdl.org/projects/SDL_mixer/docs/index.html)

 