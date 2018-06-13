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

describe("SDL2 TTF Test", () => {
    describe("load() with fastcall", () => {
        it("should load SDL2 TTF APIs", () => {
            testFontLibraryVersion(sdl2link().withFastcall(require('fastcall')))
        });
    });
    describe("load() with ffi", () => {
        it("should load SDL2 TTF APIs", () => {
            testFontLibraryVersion(sdl2link().withFFI(require('ffi-napi'), require('ref-napi')))
        });
    });
});

function testFontLibraryVersion(loader) {
    const SDL = loader.withTTF().load();
    const version = SDL.toObject(SDL.TTF_Linked_Version());

    assert.isAtLeast(version.major, 2);
    assert.isAtLeast(version.minor, 0);
    assert.isAtLeast(version.patch, 3);
}
