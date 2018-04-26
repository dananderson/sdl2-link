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

const SDL_LIBRARIES = {
    'SDL2': require('./lib/util-sdl2-library'),
    'SDL2_image': require('./lib/util-sdl2-image-library'),
    'SDL2_ttf': require('./lib/util-sdl2-ttf-library'),
};

function extendType(ref, type) {
    type.alloc = jsObject => ref.alloc(type, jsObject);

    return type;
}

function loadFFIPackage(options) {
    let ffi;

    console.assert(options.ffi_package, 'FFI package must be provided. Package is an object with ffi and ref implementations.');
    console.assert(options.ffi_package.ffi, 'ffi implementation not provided.');
    console.assert(options.ffi_package.ref, 'ref implementation not provided.');

    if ('StructType' in options.ffi_package) {
        const fastcall = options.ffi_package;

        ffi = {
            ffi: fastcall.ffi,
            ref: fastcall.ref,
            Array: fastcall.ArrayType,
            Struct: fastcall.StructType,
            Union: fastcall.UnionType,
        };
    } else {
        ffi = {
            ffi: options.ffi_package.ffi,
            ref: options.ffi_package.ref,
            Array: require('ref-array-di')(options.ffi_package.ref),
            Struct: require('ref-struct-di')(options.ffi_package.ref),
            Union: require('ref-union-di')(options.ffi_package.ref),
        };
    }

    const ref = ffi.ref;
    const UnionType = ffi.Union;
    const StructType = ffi.Struct;

    ffi.Union = definition => extendType(ref, UnionType(definition));
    ffi.Struct = definition => extendType(ref, StructType(definition));

    return ffi;
}

module.exports = function(options) {
    const ffi = loadFFIPackage(options);

    console.assert(options.libs.length >= 1, `List of SDL libraries to load must be provided. Available library names: '${Object.keys(SDL_LIBRARIES).join(', ')}'`);

    options.libs.forEach((i) => {
        console.assert(i in SDL_LIBRARIES, `Invalid SDL library name: ${i}. Available library names: '${Object.keys(SDL_LIBRARIES).join(', ')}'`);
    });

    const lib = {};

    SDL_LIBRARIES['SDL2'].loadConstantsAndTypes(ffi, lib);

    options.libs.forEach((i) => {
        if (i !== 'SDL2') {
            SDL_LIBRARIES[i].loadConstantsAndTypes(ffi, lib);
        }

        SDL_LIBRARIES[i].loadFunctions(ffi, lib);
    });

    return lib;
};
