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

describe("Struct/Union toBuffer() Test", () => {
    describe("toBuffer() with fastcall", () => {
        it("should create an empty SDL_Rect buffer", () => {
            testDefaultInitializer(sdl2link().withFastcall(fastcall));
        });
        it("should create an initialized SDL_Rect buffer", () => {
            testInitializer(sdl2link().withFastcall(fastcall));
        });
        it("should be compatible with Struct", () => {
            testCompatibleWithStruct(sdl2link().withFastcall(fastcall))
        });
    });
    describe("toBuffer() with ffi", () => {
        it("should create an empty SDL_Rect buffer", () => {
            testDefaultInitializer(sdl2link().withFFI(ffi, ref));
        });
        it("should create an initialized SDL_Rect buffer", () => {
            testInitializer(sdl2link().withFFI(ffi, ref));
        });
        it("should be compatible with Struct", () => {
            testCompatibleWithStruct(sdl2link().withFFI(ffi, ref))
        });
    });
});

function testDefaultInitializer(loader) {
    const SDL = loader.load();
    const buffer = SDL.SDL_Rect.toBuffer();

    checkBuffer(buffer, SDL.SDL_Rect);
    checkRect(buffer.deref(), 0, 0, 0, 0);
}

function testInitializer(loader) {
    const SDL = loader.load();
    const buffer = SDL.SDL_Rect.toBuffer({x: 1, y: 2, w: 3, h: 4});

    checkBuffer(buffer, SDL.SDL_Rect);
    checkRect(buffer.deref(), 1, 2, 3, 4);
}

function testCompatibleWithStruct(loader) {
    const SDL = loader.load();
    const rect = new SDL.SDL_Rect(SDL.SDL_Rect.toBuffer({x: 1, y: 2, w: 3, h: 4}));

    checkRect(rect, 1, 2, 3, 4);
}

function checkBuffer(buffer, type) {
    assert.instanceOf(buffer, Buffer);
    assert.equal(buffer.type, type);
    assert.equal(buffer.length, type.size);
}

function checkRect(rect, x, y, w, h) {
    assert.equal(rect.x, x);
    assert.equal(rect.y, y);
    assert.equal(rect.w, w);
    assert.equal(rect.h, h);
}
