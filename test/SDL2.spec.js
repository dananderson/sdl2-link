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
const ffi = require('ffi-napi');
const ref = require('ref-napi');

describe("SDL2 Test", () => {
    let SDL;

    describe("load() - fastcall", () => {
        it("should load SDL2 API", () => {
            testVersion(SDL = sdl2link().withFastcall(fastcall).load());
        });
        it("should fail without native call library", () => {
            assert.throws(() => sdl2link().load());
        });
    });
    describe("load() - ffi", () => {
        it("should load SDL2 API", () => {
            testVersion(SDL = sdl2link().withFFI(ffi, ref).load());
        });
        it("should fail without ref library", () => {
            assert.throws(() => sdl2link().withFFI(ffi, null).load());
        });
    });
    describe("toCString() - fastcall", () => {
        it("should convert JS string to char pointer", () => {
            SDL = sdl2link()
                .withFastcall(fastcall)
                .load();

            const cstring = SDL.toCString('test');

            assert.equal(cstring.length, 4);
            assert.equal(SDL.fromCString(cstring), 'test');
        });
    });
    describe("toCString() - ffi", () => {
        it("should convert JS string to char pointer", () => {
            SDL = sdl2link()
                .withFFI(ffi, ref)
                .load();

            const cstring = SDL.toCString('test');

            // ffi includes the null terminated byte..
            assert.equal(cstring.length, 5);
            assert.equal(SDL.fromCString(cstring), 'test');
        });
    });
    describe("toObject()", () => {
        it("should throw Error for null Buffer arg", () => {
            SDL = sdl2link().withFastcall(fastcall).load();
            assert.throws(() => SDL.toObject(null));
        });
        it("should throw Error for non-Buffer arg", () => {
            SDL = sdl2link().withFastcall(fastcall).load();
            assert.throws(() => SDL.toObject('test'));
        });
        it("should throw Error for SDL_Rect**", () => {
            SDL = sdl2link().withFastcall(fastcall).load();
            assert.throws(() => SDL.toObject(SDL.ref.alloc(SDL.ref.refType(SDL.SDL_Rect))));
        });
        it("should return empty object for NULL pointer Buffer", () => {
            SDL = sdl2link().withFastcall(fastcall).load();
            assert.exists(SDL.toObject(SDL.ref.NULL));
        });
        it("should convert Buffer to JS Object", () => {
            SDL = sdl2link().withFastcall(fastcall).load();
            const rect = SDL.toObject(SDL.SDL_Rect.toBuffer({x: 1, y: 2, w: 3, h: 4}));

            assert.equal(rect.x, 1);
            assert.equal(rect.y, 2);
            assert.equal(rect.w, 3);
            assert.equal(rect.h, 4);
            assert.isFunction(rect.ref);
        });
        it("should convert 0 length Buffer to JS Object", () => {
            SDL = sdl2link().withFastcall(fastcall).load();
            const rectBuffer = SDL.SDL_Rect.toBuffer({x: 1, y: 2, w: 3, h: 4});
            // Simulates what the native call libraries return for struct and union pointers, a buffer pointing to
            // a struct but length is incorrectly reported as 0.
            const rectBufferZeroLength = rectBuffer.reinterpret(rectBuffer, 0);
            // reinterpret loses type information..
            rectBufferZeroLength.type = rectBuffer.type;
            
            assert.equal(rectBufferZeroLength.length, 0);

            const rect = SDL.toObject(rectBufferZeroLength);

            assert.equal(rect.x, 1);
            assert.equal(rect.y, 2);
            assert.equal(rect.w, 3);
            assert.equal(rect.h, 4);
            assert.isFunction(rect.ref);
        });
        it("should deref struct pointer to JS object", () => {
            testToObject(SDL = sdl2link().withFastcall(fastcall).load());
        });
        it("should deref struct pointer to JS object (with ffi)", () => {
            testToObject(SDL = sdl2link().withFFI(ffi, ref).load());
        });
    });
    afterEach(() => {
        SDL && SDL.SDL_Quit();
        SDL = null;
    });
});

function testVersion(SDL) {
    const version = new SDL.SDL_version();

    SDL.SDL_GetVersion(version.ref());

    assert.isAtLeast(version.major, 2);
    assert.isAtLeast(version.minor, 0);
    assert.isAtLeast(version.patch, 8);
}

function testToObject(SDL) {
    SDL.SDL_Init(SDL.SDL_INIT_VIDEO);

    const pixelFormat = SDL.SDL_AllocFormat(SDL.SDL_PIXELFORMAT_RGBA8888);

    try {
        assert.equal(SDL.toObject(pixelFormat).format, SDL.SDL_PIXELFORMAT_RGBA8888);
    } finally {
        SDL.SDL_FreeFormat(pixelFormat);
    }
}
