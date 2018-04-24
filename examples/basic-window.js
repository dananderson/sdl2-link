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
const SDL2 = require('../lib')({ ffi: ffi, ref: ref });

const SCREEN_WIDTH = 960;
const SCREEN_HEIGHT = 480;
const FRAME_TIME_MS = 1000 / 60;

SDL2.SDL_Init(SDL2.SDL_INIT_VIDEO);

let window = SDL2.SDL_CreateWindow(ref.allocCString("Basic Window"), 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, SDL2.SDL_WindowFlags.SDL_WINDOW_OPENGL);

let renderer = SDL2.SDL_CreateRenderer(window, -1,
    SDL2.SDL_RendererFlags.SDL_RENDERER_ACCELERATED | SDL2.SDL_RendererFlags.SDL_RENDERER_PRESENTVSYNC);

function loop() {
    let eventBuffer = SDL2.SDL_Event.toBuffer();

    while (SDL2.SDL_PollEvent(eventBuffer)) {
        let event = eventBuffer.deref();

        if (event.type === SDL2.SDL_EventType.SDL_QUIT || event.type === SDL2.SDL_EventType.SDL_KEYUP) {
            SDL2.SDL_DestroyRenderer(renderer);
            SDL2.SDL_DestroyWindow(window);
            SDL2.SDL_Quit();
            return;
        }
    }

    setTimeout(loop, FRAME_TIME_MS);

    SDL2.SDL_SetRenderDrawColor(renderer, 0, 0, 200, 255);
    SDL2.SDL_RenderFillRect(renderer, SDL2.SDL_Rect.toBuffer({ x: 0, y: 0, w: SCREEN_WIDTH, h: SCREEN_HEIGHT }));
    SDL2.SDL_RenderPresent(renderer);
}

loop();
