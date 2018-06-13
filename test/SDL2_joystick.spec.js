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

const sdl2link = require('..');
const assert = require('chai').assert;
const fastcall = require('fastcall');
const ref = require('ref-napi');
const ffi = require('ffi-napi');

describe("SDL2 Joystick Test", () => {
    let SDL;
    
    describe("load() with fastcall", () => {
        it("should not load joystick functions", () => {
            assert.throws(() => sdl2link()
                .withFastcall(fastcall)
                .withJoystick()
                .load()
            );
        });
    });
    describe("load() with ffi", () => {
        it("should load joystick functions", () => {
            SDL = sdl2link()
                .withFFI(ffi, ref)
                .withJoystick()
                .load();

            checkJoystickApis(SDL);
        });
        it("should load joystick functions", () => {
            SDL = sdl2link()
                .withFastcall(fastcall)
                .withFFI(ffi)
                .withJoystick()
                .load();

            checkJoystickApis(SDL);
        });
    });
    afterEach(() => {
        SDL && SDL.SDL_Quit();
        SDL = null;
    });
});

function checkJoystickApis(SDL) {
    SDL.SDL_Init(SDL.SDL_INIT_VIDEO | SDL.SDL_INIT_JOYSTICK);

    const controllerButtonA = SDL.SDL_GameControllerButton.SDL_CONTROLLER_BUTTON_A;

    assert.equal(
        SDL.fromCString(SDL.SDL_GameControllerGetStringForButton(controllerButtonA)),
        'a');

    assert.equal(
        SDL.SDL_GameControllerGetButtonFromString(SDL.toCString('a')),
        SDL.SDL_GameControllerButton.SDL_CONTROLLER_BUTTON_A);
}