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

describe("SDL2 Test", () => {
    describe("load()", () => {
        it("should load with fastcall", () => {
            const SDL = sdl2link()
                .withFastcall(require('fastcall'))
                .load();

            checkVersion(SDL);

        });
        it("should load with ffi", () => {
            const SDL = sdl2link()
                .withFFI(require('ffi-napi'), require('ref-napi'))
                .load();

            checkVersion(SDL);

        });
        it("should fail without native call library", () => {
            assert.throws(() => sdl2link().load());
        });
        it("should fail without ref library", () => {
            assert.throws(() => sdl2link().withFFI(require('ffi-napi'), null).load());
        });
        it("should load joystick functions with ffi", () => {
            const SDL = sdl2link()
                .withFFI(require('ffi-napi'), require('ref-napi'))
                .withJoystick()
                .load();

            const controllerButtonA = SDL.SDL_GameControllerButton.SDL_CONTROLLER_BUTTON_A;

            assert.equal(
                SDL.fromCString(SDL.SDL_GameControllerGetStringForButton(controllerButtonA)),
                'a');

            assert.equal(
                SDL.SDL_GameControllerGetButtonFromString(SDL.toCString('a')),
                SDL.SDL_GameControllerButton.SDL_CONTROLLER_BUTTON_A);

        });
        it("should not load joystick functions with fastcall", () => {
            assert.throws(() => sdl2link()
                .withFastcall(require('fastcall'))
                .withJoystick()
                .load()
            );
        });
    });
});

function checkVersion(SDL) {
    let versionRef = SDL.SDL_version.alloc();
    
    SDL.SDL_GetVersion(versionRef);

    let version = versionRef.deref();

    assert.isAtLeast(version.major, 2);
    assert.isAtLeast(version.minor, 0);
    assert.isAtLeast(version.patch, 8);
}