const ref = require('ref-napi');
const ffi = require('ffi-napi');
const SDL2 = require('sdl2-link')({ ffi: ffi, ref: ref, extensions: [ 'SDL2_ttf' ] });

SDL2.SDL_Init(SDL2.SDL_INIT_VIDEO);

const window = SDL2.SDL_CreateWindow(ref.allocCString("Render Text"), SDL2.SDL_WINDOWPOS_CENTERED, SDL2.SDL_WINDOWPOS_CENTERED, 960, 480, 0);
const renderer = SDL2.SDL_CreateRenderer(window, -1, SDL2.SDL_WindowFlags.SDL_WINDOW_OPENGL);

SDL2.TTF_Init();

const openSans = SDL2.TTF_OpenFont(ref.allocCString("OpenSans-Regular.ttf"), 36);
const messageSurface = SDL2.TTF_RenderText_Blended(openSans, ref.allocCString('Press any key to exit'), {r: 255, g: 255, b: 255, a: 255});
const messageWidth = messageSurface.deref().w;
const messageHeight = messageSurface.deref().h;
const messageTexture = SDL2.SDL_CreateTextureFromSurface(renderer, messageSurface);

SDL2.SDL_FreeSurface(messageSurface);

loop();

function loop() {
    const eventRef = SDL2.SDL_Event.alloc();

    while (SDL2.SDL_PollEvent(eventRef)) {
        if (eventRef.deref().type === SDL2.SDL_EventType.SDL_KEYUP) {
            SDL2.SDL_DestroyRenderer(renderer);
            SDL2.SDL_DestroyWindow(window);
            SDL2.TTF_Quit();
            SDL2.SDL_Quit();
            return;
        }
    }

    setTimeout(loop, 1000 / 60);

    SDL2.SDL_SetRenderDrawColor(renderer, 0, 0, 200, 255);
    SDL2.SDL_RenderClear(renderer);
    SDL2.SDL_RenderCopy(renderer, messageTexture, SDL2.SDL_Rect.alloc({ x: 0, y: 0, w: messageWidth, h: messageHeight }),
        SDL2.SDL_Rect.alloc({ x: 960 / 2 - messageWidth / 2, y: 480 / 2 - messageHeight / 2, w: messageWidth, h: messageHeight }));
    SDL2.SDL_RenderPresent(renderer);
}