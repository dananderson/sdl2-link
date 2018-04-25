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

const SDL_LIBRARY_LOADER = {
    'SDL2': './lib/util-sdl2-library',
    'SDL2_image': './lib/util-sdl2-image-library',
    'SDL2_ttf': './lib/util-sdl2-ttf-library',
};

function extendType(ref, type) {
    type.toBuffer = jsObject => ref.alloc(type, jsObject);

    return type;
}

module.exports = function(options) {
    console.assert(options.ffi, 'ffi interface must be provided.');
    console.assert(options.ref, 'ref interface must be provided.');

    if (!options.lib) {
        options.lib = 'SDL2';
    }

    console.assert(options.lib in SDL_LIBRARY_LOADER,
        `Invalid SDL library name: '${options.lib}'. Available library names: '${Object.keys(SDL_LIBRARY_LOADER).join("', '")}'`);

    const ref = options.ref;
    const UnionType = require('ref-union-di')(ref);
    const StructType = require('ref-struct-di')(ref);
    const ArrayType = require('ref-array-di')(ref);
    const complexTypes = {
        'Union': definition => extendType(ref, UnionType(definition)),
        'Struct': definition => extendType(ref, StructType(definition)),
        'Array': ArrayType,
    };

    let libFile;

    if (process.platform === 'win32') {
        libFile = `${options.lib}.dll`;
    } else if (process.platform === 'darwin') {
        libFile = `lib${options.lib}.dylib`;
    } else {
        libFile = `lib${options.lib}.so`;
    }

    return require(SDL_LIBRARY_LOADER[options.lib])(options.ffi, ref, complexTypes, libFile);
};
