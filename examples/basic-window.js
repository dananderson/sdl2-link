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
const SDL2 = require('..')({ ffi_package: { ffi: ffi, ref: ref }, libs: [ 'SDL2', 'SDL2_image', 'SDL2_ttf' ] });

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 480;
const FRAME_TIME_MS = 1000 / 60;

SDL2.SDL_Init(SDL2.SDL_INIT_VIDEO);

const windowRef = ref.alloc('void**');
const rendererRef = ref.alloc('void**');

SDL2.SDL_CreateWindowAndRenderer(SCREEN_WIDTH, SCREEN_HEIGHT, SDL2.SDL_WindowFlags.SDL_WINDOW_OPENGL, windowRef, rendererRef);

const renderer = rendererRef.deref();
const event = SDL2.SDL_Event.alloc();
const screenRect = SDL2.SDL_Rect.alloc({ x: 0, y: 0, w: SCREEN_WIDTH, h: SCREEN_HEIGHT });

function loop() {
    while (SDL2.SDL_PollEvent(event)) {
        if (event.deref().type === SDL2.SDL_EventType.SDL_KEYUP) {
            SDL2.SDL_DestroyRenderer(renderer);
            SDL2.SDL_DestroyWindow(windowRef.deref());
            SDL2.SDL_Quit();
            return;
        }
    }

    setTimeout(loop, FRAME_TIME_MS);

    SDL2.SDL_SetRenderDrawColor(renderer, 0, 0, 200, 255);
    SDL2.SDL_RenderFillRect(renderer, screenRect);
    SDL2.SDL_RenderPresent(renderer);
}

loop();
