/*
 * Copyright 2018 Daniel Anderson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const ref = require('ref-napi');
const ffi = require('ffi-napi');
const SDL2 = require('sdl2-link')({ ffi: ffi, ref: ref, extensions: [ 'SDL2_image' ] });

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 427;

SDL2.SDL_Init(SDL2.SDL_INIT_VIDEO);

const window = SDL2.SDL_CreateWindow(ref.allocCString("Render Image"), SDL2.SDL_WINDOWPOS_CENTERED, SDL2.SDL_WINDOWPOS_CENTERED, IMAGE_WIDTH, IMAGE_HEIGHT, 0);
const renderer = SDL2.SDL_CreateRenderer(window, -1, SDL2.SDL_WindowFlags.SDL_WINDOW_OPENGL);

SDL2.IMG_Init(SDL2.IMG_INIT_JPEG);

const texture = SDL2.IMG_LoadTexture(renderer, ref.allocCString('sample.jpeg'));

loop();

function loop() {
    const eventRef = SDL2.SDL_Event.alloc();

    while (SDL2.SDL_PollEvent(eventRef)) {
        if (eventRef.deref().type === SDL2.SDL_EventType.SDL_KEYUP) {
            SDL2.SDL_DestroyTexture(texture);
            SDL2.SDL_DestroyRenderer(renderer);
            SDL2.SDL_DestroyWindow(window);
            SDL2.IMG_Quit();
            SDL2.SDL_Quit();
            return;
        }
    }

    setTimeout(loop, 1000 / 60);

    SDL2.SDL_RenderCopy(renderer, texture, SDL2.SDL_Rect.alloc({ x: 0, y: 0, w: IMAGE_WIDTH, h: IMAGE_HEIGHT }), ref.NULL);
    SDL2.SDL_RenderPresent(renderer);
}
