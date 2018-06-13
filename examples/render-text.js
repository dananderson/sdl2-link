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
    .withTTF()
    .load();

let gWindowPtr;
let gRendererPtr;
let gMessageTexturePtr;

function setup() {
    // Initialize SDL video and the font extension.
    SDL.SDL_Init(SDL.SDL_INIT_VIDEO);
    SDL.TTF_Init();

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

    // Render a string to a texture.
    const openSans = SDL.TTF_OpenFont(SDL.toCString("OpenSans-Regular.ttf"), 36);
    const messageSurfacePtr = SDL.TTF_RenderText_Blended(openSans, SDL.toCString('Press any key to exit'), 0xFFFFFFFF);

    gMessageTexturePtr = SDL.SDL_CreateTextureFromSurface(gRendererPtr, messageSurfacePtr);

    SDL.SDL_FreeSurface(messageSurfacePtr);
}

function shutdown() {
    // Clean up renderer and window.
    SDL.SDL_DestroyTexture(gMessageTexturePtr);
    SDL.SDL_DestroyRenderer(gRendererPtr);
    SDL.SDL_DestroyWindow(gWindowPtr);

    // Clean up the font extension and SDL itself.
    SDL.SDL_Quit();
    SDL.SDL_Quit();
}

function loop() {
    const eventRef = new SDL.SDL_Event().ref();

    while (SDL.SDL_PollEvent(eventRef)) {
        if (eventRef.deref().type === SDL.SDL_EventType.SDL_KEYUP
                || eventRef.deref().type === SDL.SDL_EventType.SDL_QUIT) {
            shutdown();
            return;
        }
    }

    // Schedule the next frame @ 60 fps.
    setTimeout(loop, 1000 / 60);

    const { width, height } = getTextureSize(gMessageTexturePtr);
    const destRect = new SDL.SDL_Rect({x: 800 / 2 - width / 2, y: 600 / 2 - height / 2, w: width, h: height });

    // Draw the text centered on the screen.
    SDL.SDL_SetRenderDrawColor(gRendererPtr, 0, 0, 200, 255);
    SDL.SDL_RenderClear(gRendererPtr);
    SDL.SDL_RenderCopy(gRendererPtr, gMessageTexturePtr, null, destRect.ref());

    // Present the frame on screen.
    SDL.SDL_RenderPresent(gRendererPtr);
}

function getTextureSize(texturePtr) {
    const widthPtr = SDL.ref.alloc('int'), heightPtr = SDL.ref.alloc('int');

    SDL.SDL_QueryTexture(gMessageTexturePtr, null, null, widthPtr, heightPtr);

    return { width: widthPtr.deref() , height: heightPtr.deref() };
}

setup();
loop();