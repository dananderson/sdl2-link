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

const sdl2link = require('sdl2-link');
const SDL = sdl2link()
    .withFastcall(require('fastcall'))
    .load();

let gWindowPtr;
let gRendererPtr;

function setup() {
    // Initialize SDL video.
    SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

    // Allocate buffers for the window and renderer references. In C terms, these buffers are analogous to a SDL_Window**
    // and SDL_Renderer**.
    const windowPtrPtr = SDL.ref.alloc('void*');
    const rendererPtrPtr = SDL.ref.alloc('void*');

    // Create an SDL window.
    SDL.SDL_CreateWindowAndRenderer(
        800,
        600,
        SDL.SDL_WindowFlags.SDL_WINDOW_OPENGL,
        windowPtrPtr,
        rendererPtrPtr);

    // Dereference the window and renderer buffers so they are usable by SDL functions. In C terms, these buffers are now
    // analogous to SDL_Window* and SDL_Renderer*.
    gWindowPtr = windowPtrPtr.deref();
    gRendererPtr = rendererPtrPtr.deref();
}

function shutdown() {
    // Clean up renderer and window.
    SDL.SDL_DestroyRenderer(gRendererPtr);
    SDL.SDL_DestroyWindow(gWindowPtr);

    // Clean up SDL.
    SDL.SDL_Quit();
}

function loop() {
    // Stop the loop when a quit event (window closed) is received.
    if(SDL.SDL_QuitRequested()) {
        shutdown();
        return;
    }

    // Schedule the next frame @ 60 fps.
    setTimeout(loop, 1000 / 60);

    // Fill drawing area with blue.
    SDL.SDL_SetRenderDrawColor(gRendererPtr, 0, 0, 200, 255);
    SDL.SDL_RenderClear(gRendererPtr);

    // Present the frame on screen.
    SDL.SDL_RenderPresent(gRendererPtr);
}

setup();
loop();